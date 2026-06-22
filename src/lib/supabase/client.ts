'use client'

import { createBrowserClient } from "@supabase/ssr";
import { createServerSupabaseClient as createServerClient } from "./server";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

// Re-export the server client for convenience
export { createServerClient };
