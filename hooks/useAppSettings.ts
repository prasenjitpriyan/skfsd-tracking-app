import { supabase } from '@/integrations/supabase/runtime-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface EmailReminderSettings {
  enabled: boolean;
  hour: number;
  minute: number;
  timezone: string;
}

export const useAppSettings = <T>(key: string) => {
  return useQuery({
    queryKey: ['app_settings', key],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('app_settings')
        .select('*')
        .eq('key', key)
        .maybeSingle();

      if (error) throw error;
      return data?.value as T | null;
    },
  });
};

export const useUpdateAppSetting = <T>() => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: T }) => {
      // First check if setting exists
      const { data: existing } = await supabase
        .from('app_settings')
        .select('id')
        .eq('key', key)
        .maybeSingle();

      if (existing) {
        // Update existing
        const { data, error } = await supabase
          .from('app_settings')
          .update({ value: JSON.parse(JSON.stringify(value)) })
          .eq('key', key)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Insert new
        const { data, error } = await supabase
          .from('app_settings')
          .insert([{ key, value: JSON.parse(JSON.stringify(value)) }])
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['app_settings', variables.key],
      });
    },
  });
};

export const useEmailReminderSettings = () => {
  return useAppSettings<EmailReminderSettings>('email_reminders');
};

export const useUpdateEmailReminderSettings = () => {
  return useUpdateAppSetting<EmailReminderSettings>();
};
