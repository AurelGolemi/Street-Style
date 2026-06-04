/**
 * Supabase client exports
 *
 * createBrowserClient: Use in Client Components (React hooks, event handlers)
 * createServerSupabaseClient: Use in Server Actions and Route Handlers
 *
 * Session refresh and cookie propagation is handled by:
 * - lib/supabase/proxy.ts (middleware - runs on every request)
 * - lib/supabase/server.ts (server client for actions)
 */

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
