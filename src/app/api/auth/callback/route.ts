// app/auth/callback/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const nextPath = url.searchParams.get('next') ?? '/';

  if (!code) {
    return NextResponse.redirect(new URL('/auth/error', request.url));
  }

  // create server client which is configured to set cookies on the response
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );

  // Exchange code for session (creates tokens and will produce cookies)
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('exchangeCodeForSession error', error);
    return NextResponse.redirect(new URL('/auth/error', request.url));
  }

  // Redirect to next (cookies set by supabase client will be included)
  return NextResponse.redirect(new URL(nextPath, request.url));
}