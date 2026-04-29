import { supabase } from '@/integrations/supabase/runtime-client';

export interface RateLimitStatus {
  allowed: boolean;
  attemptsRemaining: number;
  blockedUntil: string | null;
  isAccountLocked?: boolean;
}

export interface RateLimitError {
  isRateLimited: true;
  blockedUntil: string | null;
  message: string;
  isAccountLocked?: boolean;
}

export interface RecordAttemptResult {
  success: boolean;
  accountLocked?: boolean;
  lockedUntil?: string;
  totalFailures?: number;
}

export interface AccountLockoutStatus {
  isLocked: boolean;
  lockedUntil: string | null;
  failedAttempts: number;
}

type AttemptType = 'login' | 'signup' | 'password_reset';

/**
 * Check if an authentication attempt is allowed based on rate limiting and account lockout
 */
export const checkRateLimit = async (
  identifier: string,
  attemptType: AttemptType
): Promise<RateLimitStatus> => {
  try {
    const { data, error } = await supabase.functions.invoke('auth-rate-limit', {
      body: {
        action: 'check',
        identifier,
        attemptType,
      },
    });

    if (error) {
      console.error('Rate limit check failed:', error);
      // Fail open - allow the attempt if we can't check
      return { allowed: true, attemptsRemaining: 5, blockedUntil: null, isAccountLocked: false };
    }

    return data as RateLimitStatus;
  } catch (err) {
    console.error('Rate limit check error:', err);
    // Fail open - allow the attempt if we can't check
    return { allowed: true, attemptsRemaining: 5, blockedUntil: null, isAccountLocked: false };
  }
};

/**
 * Check if an account is locked
 */
export const checkAccountLockout = async (email: string): Promise<AccountLockoutStatus> => {
  try {
    const { data, error } = await supabase.functions.invoke('auth-rate-limit', {
      body: {
        action: 'check_lockout',
        email,
      },
    });

    if (error) {
      console.error('Account lockout check failed:', error);
      return { isLocked: false, lockedUntil: null, failedAttempts: 0 };
    }

    return data as AccountLockoutStatus;
  } catch (err) {
    console.error('Account lockout check error:', err);
    return { isLocked: false, lockedUntil: null, failedAttempts: 0 };
  }
};

/**
 * Record an authentication attempt result
 */
export const recordAuthAttempt = async (
  identifier: string,
  attemptType: AttemptType,
  success: boolean
): Promise<RecordAttemptResult> => {
  try {
    const { data, error } = await supabase.functions.invoke('auth-rate-limit', {
      body: {
        action: 'record',
        identifier,
        attemptType,
        success,
      },
    });

    if (error) {
      console.error('Failed to record auth attempt:', error);
      return { success: true, accountLocked: false };
    }

    return data as RecordAttemptResult;
  } catch (err) {
    // Don't fail the auth flow just because recording failed
    console.error('Failed to record auth attempt:', err);
    return { success: true, accountLocked: false };
  }
};

/**
 * Format the blocked until time for display
 */
export const formatBlockedUntil = (blockedUntil: string | null): string => {
  if (!blockedUntil) return '';
  
  const blockedDate = new Date(blockedUntil);
  const now = new Date();
  const diffMs = blockedDate.getTime() - now.getTime();
  
  if (diffMs <= 0) return '';
  
  const diffMinutes = Math.ceil(diffMs / (1000 * 60));
  
  if (diffMinutes <= 1) return 'less than a minute';
  if (diffMinutes < 60) return `${diffMinutes} minutes`;
  
  const diffHours = Math.ceil(diffMinutes / 60);
  return `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
};
