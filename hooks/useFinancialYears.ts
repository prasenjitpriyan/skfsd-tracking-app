import { supabase } from '@/integrations/supabase/runtime-client';
import type { TablesInsert } from '@/integrations/supabase/types';
import { financialYearSchema, validateInput } from '@/lib/validationSchemas';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
export interface FinancialYear {
  id: string;
  year_name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
}

export const useFinancialYears = () => {
  return useQuery({
    queryKey: ['financial_years'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('financial_years')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) throw error;
      return data as FinancialYear[];
    },
  });
};

export const useActiveFinancialYear = () => {
  return useQuery({
    queryKey: ['active_financial_year'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('financial_years')
        .select('*')
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      return data as FinancialYear | null;
    },
  });
};

export const useCreateFinancialYear = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (year: TablesInsert<'financial_years'>) => {
      // Validate input before sending to database
      validateInput(financialYearSchema, year);

      const { data, error } = await supabase
        .from('financial_years')
        .insert(year)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial_years'] });
      queryClient.invalidateQueries({ queryKey: ['active_financial_year'] });
    },
  });
};

export const useSetActiveYear = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (yearId: string) => {
      // First, deactivate all years
      await supabase
        .from('financial_years')
        .update({ is_active: false })
        .neq('id', '');

      // Then activate the selected year
      const { data, error } = await supabase
        .from('financial_years')
        .update({ is_active: true })
        .eq('id', yearId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial_years'] });
      queryClient.invalidateQueries({ queryKey: ['active_financial_year'] });
    },
  });
};

export const useToggleFinancialYear = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      is_active,
    }: {
      id: string;
      is_active: boolean;
    }) => {
      const { data, error } = await supabase
        .from('financial_years')
        .update({ is_active })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial_years'] });
      queryClient.invalidateQueries({ queryKey: ['active_financial_year'] });
    },
  });
};
