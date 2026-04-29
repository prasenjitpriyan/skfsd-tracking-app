import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/runtime-client';
import { deliveryCentreSchema, validateInput } from '@/lib/validationSchemas';
import { sortByName } from '@/lib/orderingUtils';
import type { TablesInsert } from '@/integrations/supabase/types';
export interface DeliveryCentre {
  id: string;
  name: string;
  centre_code: string | null;
  created_at: string;
}

export const useDeliveryCentres = () => {
  return useQuery({
    queryKey: ['delivery_centres'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('delivery_centres')
        .select('*');

      if (error) throw error;
      return sortByName(data as DeliveryCentre[]);
    },
  });
};

export const useCreateDeliveryCentre = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (centre: TablesInsert<'delivery_centres'>) => {
      // Validate input before sending to database
      validateInput(deliveryCentreSchema, centre);

      const { data, error } = await supabase
        .from('delivery_centres')
        .insert(centre)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery_centres'] });
    },
  });
};
