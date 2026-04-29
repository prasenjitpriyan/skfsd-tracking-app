import { supabase } from '@/integrations/supabase/runtime-client';
import { Database } from '@/integrations/supabase/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

type AppRole = Database['public']['Enums']['app_role'];

interface UserWithDetails {
  id: string;
  email: string | null;
  full_name: string | null;
  created_at: string;
  roles: AppRole[];
  assigned_offices: { id: string; name: string }[];
  assigned_delivery_centres: { id: string; name: string }[];
}

export const useUsers = () => {
  return useQuery({
    queryKey: ['users-with-details'],
    queryFn: async (): Promise<UserWithDetails[]> => {
      // Fetch profiles via admin view (prevents email harvesting)
      // This view only returns data if the current user is an admin
      const { data: profiles, error: profilesError } = await supabase
        .from('admin_profiles_view')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch all roles via admin view (prevents role enumeration)
      // Using type assertion since this is an admin-only view not in generated types
      const { data: roles, error: rolesError } = await supabase
        .from('admin_user_roles_view' as any)
        .select('*');

      if (rolesError) throw rolesError;

      // Fetch office assignments via admin view (prevents org structure enumeration)
      const { data: officeAssignments, error: officeError } = await supabase
        .from('admin_office_assignments_view' as any)
        .select('*');

      if (officeError) throw officeError;

      // Fetch delivery centre assignments via admin view
      const { data: centreAssignments, error: centreError } = await supabase
        .from('admin_delivery_centre_assignments_view' as any)
        .select('*');

      if (centreError) throw centreError;

      // Combine data - views already include joined data
      return (profiles || []).map((profile) => ({
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        created_at: profile.created_at,
        roles: (roles || [])
          .filter((r: any) => r.user_id === profile.id)
          .map((r: any) => r.role),
        assigned_offices: (officeAssignments || [])
          .filter((a: any) => a.user_id === profile.id)
          .map((a: any) => ({
            id: a.office_id,
            name: a.office_name || 'Unknown',
          })),
        assigned_delivery_centres: (centreAssignments || [])
          .filter((a: any) => a.user_id === profile.id)
          .map((a: any) => ({
            id: a.delivery_centre_id,
            name: a.centre_name || 'Unknown',
          })),
      }));
    },
  });
};

export const useAssignRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-with-details'] });
    },
  });
};

export const useRemoveRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-with-details'] });
    },
  });
};

export const useAssignOffice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      officeId,
    }: {
      userId: string;
      officeId: string;
    }) => {
      const { error } = await supabase
        .from('user_office_assignments')
        .insert({ user_id: userId, office_id: officeId });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-with-details'] });
    },
  });
};

export const useRemoveOfficeAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      officeId,
    }: {
      userId: string;
      officeId: string;
    }) => {
      const { error } = await supabase
        .from('user_office_assignments')
        .delete()
        .eq('user_id', userId)
        .eq('office_id', officeId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-with-details'] });
    },
  });
};

export const useAssignDeliveryCentre = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      centreId,
    }: {
      userId: string;
      centreId: string;
    }) => {
      const { error } = await supabase
        .from('user_delivery_centre_assignments')
        .insert({ user_id: userId, delivery_centre_id: centreId });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-with-details'] });
    },
  });
};

export const useRemoveDeliveryCentreAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      centreId,
    }: {
      userId: string;
      centreId: string;
    }) => {
      const { error } = await supabase
        .from('user_delivery_centre_assignments')
        .delete()
        .eq('user_id', userId)
        .eq('delivery_centre_id', centreId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-with-details'] });
    },
  });
};

export const useCurrentUserAssignments = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['user-assignments', userId],
    queryFn: async () => {
      if (!userId) return null;

      const { data: officeAssignments, error: officeError } = await supabase
        .from('user_office_assignments')
        .select('office_id')
        .eq('user_id', userId);

      if (officeError) throw officeError;

      const { data: centreAssignments, error: centreError } = await supabase
        .from('user_delivery_centre_assignments')
        .select('delivery_centre_id')
        .eq('user_id', userId);

      if (centreError) throw centreError;

      return {
        officeIds: officeAssignments.map((a) => a.office_id),
        centreIds: centreAssignments.map((a) => a.delivery_centre_id),
      };
    },
    enabled: !!userId,
  });
};
