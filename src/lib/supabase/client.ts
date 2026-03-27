// lib/supabase/client.ts
// Client-side Supabase instance. Clerk token injected via hook.

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// ----------------------------------------------------------------
// useSupabaseWithAuth  (use in client components)
// ----------------------------------------------------------------
// Import this hook where you need an authenticated client-side instance.
// It injects the Clerk token so RLS resolves correctly.
//
// Usage:
//   const supabase = useSupabaseWithAuth();
//   const { data } = await supabase.from("leases").select("*");

import { useAuth } from "@clerk/nextjs";
import { useMemo } from "react";
import { SupabaseClient } from "@supabase/supabase-js";

export function useSupabaseWithAuth(): SupabaseClient {
  const { getToken } = useAuth();

  const supabase = useMemo(() => {
    const client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          fetch: async (url, options = {}) => {
            const token = await getToken({ template: "supabase" });
            return fetch(url, {
              ...options,
              headers: {
                ...(options.headers as Record<string, string>),
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
            });
          },
        },
      }
    );
    return client;
  }, [getToken]);

  return supabase;
}
