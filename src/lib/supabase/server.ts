// lib/supabase/server.ts
// Works for BOTH apps. Clerk's JWT is forwarded to Supabase so RLS
// functions (auth.clerk_user_id(), auth.clerk_role()) work correctly.

import { createServerClient } from "@supabase/ssr";
import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";

export async function createClient() {
  const { getToken } = await auth();

  // Get the Supabase-specific JWT from Clerk
  // You must create a "supabase" JWT template in Clerk dashboard:
  // Claims:  { "role": "authenticated", "metadata": "{{user.public_metadata}}" }
  const supabaseToken = await getToken({ template: "supabase" });

  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: supabaseToken
          ? { Authorization: `Bearer ${supabaseToken}` }
          : {},
      },
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server component — ignore set errors
          }
        },
      },
    }
  );
}
