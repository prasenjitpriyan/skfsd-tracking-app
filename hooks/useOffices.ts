import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/runtime-client';
import { officeSchema, validateInput } from '@/lib/validationSchemas';
import { sortByName } from '@/lib/orderingUtils';
import type { TablesInsert } from '@/integrations/supabase/types';
export interface Office {
  id: string;
  name: string;
  office_code: string | null;
  created_at: string;
}

export const useOffices = () => {
  return useQuery({
    queryKey: ['offices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('offices')
        .select('*');

      if (error) throw error;
      return sortByName(data as Office[]);
    },
  });
};

export const useCreateOffice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (office: TablesInsert<'offices'>) => {
      // Validate input before sending to database
      validateInput(officeSchema, office);

      const { data, error } = await supabase
        .from('offices')
        .insert(office)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offices'] });
    },
  });
};
