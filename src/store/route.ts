import { extractTokenFromCookie, verifyToken } from "@/lib/auth/jwt";
import { CartItem } from "@/store/CartStore";
import { NextRequest, NextResponse } from "next/server";

// Simple in-memory store for cart data
const userCarts = new Map<string, CartItem[]>();

export async function GET(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get("cookie") ?? undefined;
    const token = extractTokenFromCookie(cookieHeader);

    if (!token) {
      return NextResponse.json({ items: [] });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ items: [] });
    }

    const items = userCarts.get(decoded.userId) || [];
    return NextResponse.json({ items });
  } catch (error) {
    console.error("Cart sync error:", error);
    return NextResponse.json({ items: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get("cookie") ?? undefined;
    const token = extractTokenFromCookie(cookieHeader);

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { items } = await request.json();
    userCarts.set(decoded.userId, items);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cart sync error:", error);
    return NextResponse.json({ error: "Failed to sync cart" }, { status: 500 });
  }
}
