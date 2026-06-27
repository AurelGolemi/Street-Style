import { CartItem } from "@/store/CartStore";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import { NextRequest, NextResponse } from "next/server";

// Simple in-memory store for cart data (in production, use a database)
const userCarts = new Map<string, CartItem[]>();

async function getSessionUserId(_request: NextRequest) {
  // Uses Supabase SSR cookies (no manual JWT parsing / no jsonwebtoken)
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) return { userId: null as string | null, error };
  return { userId: user?.id ?? null, error: null };
}

export async function GET(request: NextRequest) {

  try {
    const { userId, error } = await getSessionUserId(request);

    if (error) {
      console.error("[Cart GET] Supabase error:", error.message || error);
      return NextResponse.json({ error: "Supabase error" }, { status: 500 });
    }

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const items = userCarts.get(userId) || [];
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

    const { userId, error } = await getSessionUserId(request);

    if (error) {
      console.error("[Cart POST] Supabase error:", error.message || error);
      return NextResponse.json({ error: "Supabase error" }, { status: 500 });
    }

    if (!userId) {
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
    const { userId, error } = await getSessionUserId(request);

    if (error) {
      console.error("[Cart DELETE] Supabase error:", error.message || error);
      return NextResponse.json({ error: "Supabase error" }, { status: 500 });
    }

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Clear user's cart
    userCarts.delete(userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cart delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete cart" },
      { status: 500 }
    );
  }
}

