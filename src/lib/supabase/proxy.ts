/**
 * Supabase SSR session refresh handler
 * RESPONSIBILITY: Refresh auth session and propagate cookies + cache headers
 *
 * This runs on EVERY request and ensures:
 * 1. Auth session is refreshed (getClaims() validates & refreshes JWT)
 * 2. Updated cookies are set in the response
 * 3. Cache-control headers are applied for proper browser caching
 * 4. Auth state changes (sign-in/out) propagate immediately
 */

import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { applyAuthRedirects } from "./middleware";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          // Step 1: Update request-scoped cookies for downstream rendering
          // This ensures that if we need to read cookies later in this request, they're updated
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          // Step 2: Create a NEW response object with updated request
          // This ensures the response has the latest request state
          supabaseResponse = NextResponse.next({ request });

          // Step 3: Set each cookie on the response with its options
          // These cookies will be sent to the browser
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });

          // Step 4: Apply cache-control and other headers from Supabase
          // This is CRITICAL - Supabase provides cache directives for security
          // Without this, session refresh may not work correctly on subsequent requests
          if (headers) {
            Object.entries(headers).forEach(([key, value]) => {
              supabaseResponse.headers.set(key, value as string);
            });
          }
        },
      },
    },
  );

  // CRITICAL: Call getClaims() immediately after createServerClient
  // This validates the JWT and refreshes expired tokens
  // Do NOT put code between createServerClient and getClaims()
  await supabase.auth.getClaims();

  // Apply auth-based redirects (redirect login/register if authenticated, etc.)
  return await applyAuthRedirects(request, supabaseResponse);
}
