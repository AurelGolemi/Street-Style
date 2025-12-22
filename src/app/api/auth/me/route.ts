// /api/auth/me/route.ts - Enhanced Production Implementation
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Type definitions for better IDE support and type safety
interface AuthResponse {
  user: UserData | null;
  session: SessionData | null;
  emailVerified: boolean;
  error?: string;
}

interface UserData {
  id: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  lastSignInAt?: string;
  metadata?: Record<string, unknown>;
}

interface SessionData {
  accessToken: string;
  expiresAt: number;
  expiresIn: number;
}

export async function GET(request: Request) {
  // Start timing for performance monitoring
  const startTime = Date.now();

  try {
    // Initialize Supabase client with cookie context
    const cookieStore = await cookies();
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            cookie: cookieStore
              .getAll()
              .map((c) => `${c.name}=${c.value}`)
              .join(";"),
          },
        },
      }
    );

    // Retrieve and validate session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    // Log performance metric
    const duration = Date.now() - startTime;
    if (duration > 1000) {
      console.warn(`[Auth Check] Slow response: ${duration}ms`);
    }

    // Handle session retrieval errors
    if (sessionError) {
      console.error("[Auth Check] Session error:", {
        message: sessionError.message,
        name: sessionError.name,
        status: sessionError.status,
      });

      return createAuthResponse({
        user: null,
        session: null,
        emailVerified: false,
        error: sessionError.message,
      });
    }

    // No active session
    if (!session) {
      return createAuthResponse({
        user: null,
        session: null,
        emailVerified: false,
      });
    }

    // Extract and enrich user data
    const { user } = session;
    const emailVerified = !!user.email_confirmed_at;

    // Calculate token expiration
    const expiresAt = session.expires_at || 0;
    const now = Math.floor(Date.now() / 1000);
    const expiresIn = Math.max(0, expiresAt - now);

    // Warn if token expires soon (within 5 minutes)
    if (expiresIn < 300 && expiresIn > 0) {
      console.warn("[Auth Check] Token expires soon:", {
        userId: user.id,
        expiresIn: `${expiresIn}s`,
      });
    }

    // Build response payload
    const userData: UserData = {
      id: user.id,
      email: user.email!,
      emailVerified,
      createdAt: user.created_at,
      lastSignInAt: user.last_sign_in_at,
      metadata: user.user_metadata,
      // Include profile data if fetched
      // ...profile,
    };

    const sessionData: SessionData = {
      accessToken: session.access_token,
      expiresAt,
      expiresIn,
    };

    return createAuthResponse({
      user: userData,
      session: sessionData,
      emailVerified,
    });
  } catch (error) {
    // Catch unexpected errors
    console.error("[Auth Check] Unexpected error:", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    return createAuthResponse({
      user: null,
      session: null,
      emailVerified: false,
      error: "Internal server error",
    });
  }
}

function createAuthResponse(data: AuthResponse): NextResponse {
  return NextResponse.json(data, {
    status: 200,
    headers: {
      // Prevent caching of auth state
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
      "Surrogate-Control": "no-store",

      // Security headers
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",

      // Optional: Add timing header for monitoring
      "X-Response-Time": `${Date.now()}`,
    },
  });
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin");
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_APP_URL,
    "http://localhost:3000",
    "http://localhost:3001",
  ].filter(Boolean) as string[];

  const isAllowed = allowedOrigins.some((allowed) =>
    origin?.startsWith(allowed)
  );

  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": isAllowed ? origin! : allowedOrigins[0],
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Max-Age": "86400", // Cache preflight for 24 hours
    },
  });
}
