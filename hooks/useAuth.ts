import { supabase } from '@/integrations/supabase/runtime-client';
import { Session, User } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import {
  checkRateLimit,
  formatBlockedUntil,
  RateLimitError,
  recordAuthAttempt,
} from './useRateLimit';

export interface UserRole {
  role: 'admin' | 'staff';
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if we need to restore a session-only session from sessionStorage
    const restoreSessionOnlySession = async () => {
      const isSessionOnly =
        sessionStorage.getItem('supabase_session_only') === 'true';
      const tempSession = sessionStorage.getItem('supabase_temp_session');

      if (isSessionOnly && tempSession) {
        try {
          const session = JSON.parse(tempSession);
          await supabase.auth.setSession({
            access_token: session.access_token,
            refresh_token: session.refresh_token,
          });
        } catch (e) {
          console.error('Failed to restore session:', e);
        }
      }
    };

    // Set up auth state listener FIRST
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Update sessionStorage if in session-only mode
      const isSessionOnly =
        sessionStorage.getItem('supabase_session_only') === 'true';
      if (isSessionOnly && session) {
        sessionStorage.setItem(
          'supabase_temp_session',
          JSON.stringify(session)
        );
        // Clear localStorage to prevent persistence across browser close
        setTimeout(() => {
          const keys = Object.keys(localStorage).filter((key) =>
            key.startsWith('sb-')
          );
          keys.forEach((key) => localStorage.removeItem(key));
        }, 0);
      }
    });

    // Restore session-only session if needed, then check for existing session
    restoreSessionOnlySession().then(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (
    email: string,
    password: string,
    rememberMe: boolean = true
  ): Promise<{ error: Error | null; rateLimitError?: RateLimitError }> => {
    // Check rate limit and account lockout before attempting login
    const rateLimitStatus = await checkRateLimit(email, 'login');
    if (!rateLimitStatus.allowed) {
      const waitTime = formatBlockedUntil(rateLimitStatus.blockedUntil);
      const isLocked = rateLimitStatus.isAccountLocked;
      return {
        error: null,
        rateLimitError: {
          isRateLimited: true,
          blockedUntil: rateLimitStatus.blockedUntil,
          message: isLocked
            ? `Your account has been temporarily locked due to too many failed login attempts. Please try again in ${waitTime || 'a few minutes'}.`
            : `Too many failed login attempts. Please try again in ${waitTime || 'a few minutes'}.`,
          isAccountLocked: isLocked,
        },
      };
    }

    // Configure storage based on rememberMe preference
    // sessionStorage clears on browser close, localStorage persists
    if (!rememberMe) {
      // Store a flag to indicate session-only mode
      sessionStorage.setItem('supabase_session_only', 'true');
    } else {
      sessionStorage.removeItem('supabase_session_only');
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // Record the attempt (success or failure)
    await recordAuthAttempt(email, 'login', !error);

    // If rememberMe is false and login succeeded, copy session to sessionStorage and clear localStorage
    if (!error && !rememberMe) {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        sessionStorage.setItem(
          'supabase_temp_session',
          JSON.stringify(session)
        );
        // Clear the persistent session from localStorage
        const keys = Object.keys(localStorage).filter((key) =>
          key.startsWith('sb-')
        );
        keys.forEach((key) => localStorage.removeItem(key));
      }
    }

    return { error };
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string
  ): Promise<{ error: Error | null; rateLimitError?: RateLimitError }> => {
    // Check rate limit before attempting signup
    const rateLimitStatus = await checkRateLimit(email, 'signup');
    if (!rateLimitStatus.allowed) {
      const waitTime = formatBlockedUntil(rateLimitStatus.blockedUntil);
      return {
        error: null,
        rateLimitError: {
          isRateLimited: true,
          blockedUntil: rateLimitStatus.blockedUntil,
          message: `Too many signup attempts. Please try again in ${waitTime || 'a few minutes'}.`,
        },
      };
    }

    const redirectUrl = `${window.location.origin}/`;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        },
      },
    });

    // Record the attempt
    await recordAuthAttempt(email, 'signup', !error);

    return { error };
  };

  const signOut = async () => {
    // Clear session-only mode flags
    sessionStorage.removeItem('supabase_session_only');
    sessionStorage.removeItem('supabase_temp_session');

    // Clear any Supabase localStorage items
    const keys = Object.keys(localStorage).filter((key) =>
      key.startsWith('sb-')
    );
    keys.forEach((key) => localStorage.removeItem(key));

    try {
      const { error } = await supabase.auth.signOut({ scope: 'local' });
      // Even if server returns error (e.g., session already expired), clear local state
      setUser(null);
      setSession(null);
      return { error: null };
    } catch (e) {
      // If signOut throws, still clear local state
      setUser(null);
      setSession(null);
      return { error: null };
    }
  };

  const resetPassword = async (
    email: string
  ): Promise<{ error: Error | null; rateLimitError?: RateLimitError }> => {
    // Check rate limit before attempting password reset
    const rateLimitStatus = await checkRateLimit(email, 'password_reset');
    if (!rateLimitStatus.allowed) {
      const waitTime = formatBlockedUntil(rateLimitStatus.blockedUntil);
      return {
        error: null,
        rateLimitError: {
          isRateLimited: true,
          blockedUntil: rateLimitStatus.blockedUntil,
          message: `Too many password reset attempts. Please try again in ${waitTime || 'a few minutes'}.`,
        },
      };
    }

    const redirectUrl = `${window.location.origin}/auth?reset=true`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    // Record the attempt (always success since we don't reveal if email exists)
    await recordAuthAttempt(email, 'password_reset', true);

    return { error };
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { error };
  };

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
  };
};

export const useUserRoles = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['user_roles', userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (error) throw error;
      return data as UserRole[];
    },
    enabled: !!userId,
  });
};

export const useIsAdmin = (userId: string | undefined) => {
  const { data: roles, isLoading } = useUserRoles(userId);

  const isAdmin = roles?.some((r) => r.role === 'admin') ?? false;

  return { isAdmin, isLoading };
};
