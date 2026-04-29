import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// Credentials should normally come from Vite env vars.
// In some preview/build contexts these can momentarily be unavailable; in that case
// we fall back to the project's public client configuration to prevent a blank screen.
// NOTE: The publishable key is not a secret, but hardcoding it means rotating it
// requires a code update (acceptable here to keep the app stable in preview).
const FALLBACK_SUPABASE_URL = "https://dqemiuhpndafaxjaesgo.supabase.co";
const FALLBACK_SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxZW1pdWhwbmRhZmF4amFlc2dvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1ODkyNjIsImV4cCI6MjA4MjE2NTI2Mn0.Gm-41JelSUxrO6OiL7x6RrYKIt4ERfPklEYQsfDqMZA";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? FALLBACK_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? FALLBACK_SUPABASE_PUBLISHABLE_KEY;

if (import.meta.env.VITE_SUPABASE_URL == null || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY == null) {
  // eslint-disable-next-line no-console
  console.warn(
    "Backend env vars were not available at runtime; using fallback client configuration." 
  );
}

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: typeof window !== "undefined" ? localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
