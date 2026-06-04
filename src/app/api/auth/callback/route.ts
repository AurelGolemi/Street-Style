// app/auth/callback/route.ts
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const nextPath = url.searchParams.get("next") ?? "/";

  if (!code) {
    return NextResponse.redirect(new URL("/auth/error", request.url));
  }

  try {
    // CRITICAL FIX: Use server client instead of browser client
    // Server client properly handles cookies via middleware and sets them in response
    const supabase = await createServerSupabaseClient();

    // Exchange code for session (this updates the session in cookies)
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("[OAUTH CALLBACK] exchangeCodeForSession error:", error);
      return NextResponse.redirect(new URL("/auth/error", request.url));
    }

    console.log("[OAUTH CALLBACK] Session exchanged successfully");

    // CRITICAL FIX: Revalidate after successful OAuth to sync server components
    // This clears Next.js cache so server components know about new auth state
    revalidatePath("/", "layout");

    // Redirect to next (cookies will be set by middleware)
    return NextResponse.redirect(new URL(nextPath, request.url));
  } catch (error) {
    console.error("[OAUTH CALLBACK] Unexpected error:", error);
    return NextResponse.redirect(new URL("/auth/error", request.url));
  }
}
