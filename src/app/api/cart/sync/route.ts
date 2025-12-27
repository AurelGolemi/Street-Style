import { CartItem } from "@/store/CartStore";
import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

// Simple in-memory store for cart data (in production, use a database)
const userCarts = new Map<string, CartItem[]>();

interface JwtPayload {
  sub?: string;
  user_id?: string;
  user?: { id: string };
  [key: string]: unknown;
}

async function getSupabaseSessionFromRequest(request: NextRequest) {
  // Use Next's cookies() store (like `/api/auth/me`) to reliably capture all cookies
  // (this avoids issues where middleware or proxies change request.headers)
  const cookieStore = await import("next/headers").then((m) => m.cookies());
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join(";");

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          cookie: cookieHeader,
        },
      },
    }
  );

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  // If supabase didn't find a session from cookies, try a fallback:
  // Supabase sometimes stores an `sb-<ref>-auth-token` cookie in `base64-<json>` form.
  // Try to extract the access_token from it and decode the JWT to obtain a user id.
  if (!session) {
    try {
      const rawAuthCookie = cookieHeader
        .split(";")
        .map((c) => c.trim())
        .find((c) => /-auth-token=/.test(c));

      if (rawAuthCookie) {
        const rawVal = rawAuthCookie.split("=")[1] || "";
        // If the value is base64-encoded JSON with access_token
        if (rawVal.startsWith("base64-")) {
          const jsonPart = rawVal.slice("base64-".length);
          const decodedJson = Buffer.from(jsonPart, "base64").toString("utf8");
          const parsed = JSON.parse(decodedJson);
          const access_token = parsed?.access_token;
          if (access_token) {
            const decoded = jwt.decode(access_token) as JwtPayload | null;
            const userId =
              decoded?.sub || decoded?.user_id || decoded?.user?.id;
            if (userId) {
              console.log(
                "[Cart] Fallback extracted userId from auth-token cookie:",
                userId
              );
              return {
                session: { user: { id: userId }, access_token },
                error: null,
              };
            }
          }
        }
      }
    } catch (e) {
      console.warn("[Cart] Fallback auth-token parse failed:", e);
    }
  }

  return { session, error };
}

export async function GET(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get("cookie") ?? undefined;
    console.log("[Cart GET] Cookie header:", cookieHeader);

    const { session, error } = await getSupabaseSessionFromRequest(request);

    if (error) {
      console.error("[Cart GET] Supabase error:", error.message || error);
      return NextResponse.json({ error: "Supabase error" }, { status: 500 });
    }

    if (!session) {
      console.log("[Cart GET] No supabase session - returning 401");
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = session.user?.id;
    if (!userId) {
      console.log("[Cart GET] Session present but no user id - returning 401");
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const items = userCarts.get(userId) || [];
    console.log("[Cart GET] Returning", items.length, "items for user", userId);
    return NextResponse.json({ items });
  } catch (error) {
    console.error("Cart sync error:", error);
    return NextResponse.json({ error: "Failed to load cart" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get("cookie") ?? undefined;
    console.log("[Cart POST] Cookie header:", cookieHeader);

    const { session, error } = await getSupabaseSessionFromRequest(request);

    if (error) {
      console.error("[Cart POST] Supabase error:", error.message || error);
      return NextResponse.json({ error: "Supabase error" }, { status: 500 });
    }

    if (!session) {
      console.log("[Cart POST] No supabase session - returning 401");
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = session.user?.id;
    if (!userId) {
      console.log("[Cart POST] Session present but no user id - returning 401");
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { items } = await request.json();

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: "Invalid items format" },
        { status: 400 }
      );
    }

    userCarts.set(userId, items || []);
    console.log(
      "[Cart POST] Saved",
      (items || []).length,
      "items for user",
      userId
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cart sync error:", error);
    return NextResponse.json({ error: "Failed to sync cart" }, { status: 500 });
  }
}

// DELETE endpoint to clear user's cart
export async function DELETE(request: NextRequest) {
  try {
    const { session, error } = await getSupabaseSessionFromRequest(request);

    if (error) {
      console.error("[Cart DELETE] Supabase error:", error.message || error);
      return NextResponse.json({ error: "Supabase error" }, { status: 500 });
    }

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Clear user's cart
    userCarts.delete(session.user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cart delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete cart" },
      { status: 500 }
    );
  }
}
