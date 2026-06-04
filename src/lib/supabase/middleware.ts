/**
 * Supabase middleware redirect logic
 * RESPONSIBILITY: Check auth state and redirect based on route protection rules
 * - Protect private routes (/profile, etc.) by redirecting to /login
 * - Redirect authenticated users away from /login and /register to home
 */

import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function applyAuthRedirects(
  request: NextRequest,
  supabaseResponse: NextResponse,
) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        // For middleware, we don't need setAll because we're read-only
        // Cookie refresh is handled in lib/supabase/proxy.ts
        setAll() {},
      },
    },
  );

  // Get current auth state using getUser() which checks the session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected routes - redirect to login if not authenticated
  if (!user && request.nextUrl.pathname.startsWith("/profile")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectTo", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Auth routes - redirect to home if already authenticated
  if (
    user &&
    (request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "/register")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // No redirect needed, return the proxied response with refreshed session
  return supabaseResponse;
}
