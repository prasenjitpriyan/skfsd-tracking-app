import { supabase } from '@/integrations/supabase/runtime-client';
import type { TablesInsert } from '@/integrations/supabase/types';
import { sortByCentreName } from '@/lib/orderingUtils';
import {
  dailyDeliveryDataSchema,
  validateInput,
} from '@/lib/validationSchemas';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
export interface DailyDeliveryData {
  id: string;
  delivery_centre_id: string;
  date: string;
  mail_received: number;
  mail_delivered: number;
  delivery_percentage: number;
  is_locked: boolean;
  created_at: string;
  updated_at: string;
  delivery_centres?: {
    id: string;
    name: string;
    centre_code: string | null;
  };
}

export const useDailyDeliveryData = (date: string) => {
  return useQuery({
    queryKey: ['daily_delivery_data', date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_delivery_data')
        .select(
          `
          *,
          delivery_centres (id, name, centre_code)
        `
        )
        .eq('date', date);
      if (error) throw error;
      return sortByCentreName(data as DailyDeliveryData[]);
    },
  });
};

export const useDailyDeliveryDataByYear = (
  startDate: string,
  endDate: string
) => {
  return useQuery({
    queryKey: ['daily_delivery_data_year', startDate, endDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_delivery_data')
        .select(
          `
          *,
          delivery_centres (id, name, centre_code)
        `
        )
        .gte('date', startDate)
        .lte('date', endDate);

      if (error) throw error;
      return sortByCentreName(data as DailyDeliveryData[]);
    },
    enabled: !!startDate && !!endDate,
  });
};

export const useUpsertDailyDeliveryData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TablesInsert<'daily_delivery_data'>) => {
      // Validate input before sending to database
      validateInput(dailyDeliveryDataSchema, data);

      const { data: result, error } = await supabase
        .from('daily_delivery_data')
        .upsert(data, { onConflict: 'delivery_centre_id,date' })
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['daily_delivery_data', variables.date],
      });
      queryClient.invalidateQueries({ queryKey: ['daily_delivery_data_year'] });
    },
  });
};
