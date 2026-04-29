import { supabase } from '@/integrations/supabase/runtime-client';
import type { TablesInsert } from '@/integrations/supabase/types';
import { sortByOfficeName } from '@/lib/orderingUtils';
import { dailyOfficeDataSchema, validateInput } from '@/lib/validationSchemas';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
export interface DailyOfficeData {
  id: string;
  office_id: string;
  date: string;
  account_open: number;
  account_close: number;
  net_account_addition: number;
  mail_bookings: number;
  mail_amount: number;
  ippb_account_open: number;
  ippb_premium_account_open: number;
  gi_insurance: number;
  new_policy_indexed: number;
  sum_assured: number;
  first_year_premium: number;
  renewal_premium: number;
  aadhaar_transactions: number;
  aadhaar_amount: number;
  mystamp_procurement: number;
  is_locked: boolean;
  created_at: string;
  updated_at: string;
  offices?: {
    id: string;
    name: string;
    office_code: string | null;
  };
}

export const useDailyOfficeData = (date: string) => {
  return useQuery({
    queryKey: ['daily_office_data', date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_office_data')
        .select(
          `
          *,
          offices (id, name, office_code)
        `
        )
        .eq('date', date);

      if (error) throw error;
      return sortByOfficeName(data as DailyOfficeData[]);
    },
  });
};

export const useDailyOfficeDataByYear = (
  startDate: string,
  endDate: string
) => {
  return useQuery({
    queryKey: ['daily_office_data_year', startDate, endDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_office_data')
        .select(
          `
          *,
          offices (id, name, office_code)
        `
        )
        .gte('date', startDate)
        .lte('date', endDate);

      if (error) throw error;
      return sortByOfficeName(data as DailyOfficeData[]);
    },
    enabled: !!startDate && !!endDate,
  });
};

export const useUpsertDailyOfficeData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TablesInsert<'daily_office_data'>) => {
      // Validate input before sending to database
      validateInput(dailyOfficeDataSchema, data);

      const { data: result, error } = await supabase
        .from('daily_office_data')
        .upsert(data, { onConflict: 'office_id,date' })
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: (_, variables) => {
      // Invalidate all daily office data queries to refresh dashboard
      queryClient.invalidateQueries({ queryKey: ['daily_office_data'] });
      queryClient.invalidateQueries({ queryKey: ['daily_office_data_year'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard_stats'] });
    },
  });
};
