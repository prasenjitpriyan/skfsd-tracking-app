import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/runtime-client';
import { officeTargetSchema, validateInput } from '@/lib/validationSchemas';
import { sortByOfficeName } from '@/lib/orderingUtils';
import type { TablesInsert } from '@/integrations/supabase/types';
export interface OfficeTarget {
  id: string;
  office_id: string;
  financial_year_id: string;
  account_open_target: number;
  net_account_target: number;
  mail_booking_target: number;
  mail_amount_target: number;
  ippb_account_target: number;
  ippb_premium_target: number;
  gi_insurance_target: number;
  new_policy_target: number;
  sum_assured_target: number;
  first_year_premium_target: number;
  renewal_premium_target: number;
  aadhaar_transactions_target: number;
  aadhaar_amount_target: number;
  mystamp_target: number;
  created_at: string;
  updated_at: string;
  offices?: {
    id: string;
    name: string;
    office_code: string | null;
  };
}

export const useOfficeTargets = (financialYearId: string | undefined) => {
  return useQuery({
    queryKey: ['office_targets', financialYearId],
    queryFn: async () => {
      if (!financialYearId) return [];
      
      const { data, error } = await supabase
        .from('office_targets')
        .select(`
          *,
          offices (id, name, office_code)
        `)
        .eq('financial_year_id', financialYearId);

      if (error) throw error;
      return sortByOfficeName(data as OfficeTarget[]);
    },
    enabled: !!financialYearId,
  });
};

export const useUpsertOfficeTarget = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: TablesInsert<'office_targets'>) => {
      // Validate input before sending to database
      validateInput(officeTargetSchema, data);

      const { data: result, error } = await supabase
        .from('office_targets')
        .upsert(data, { onConflict: 'office_id,financial_year_id' })
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['office_targets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard_stats'] });
    },
  });
};
