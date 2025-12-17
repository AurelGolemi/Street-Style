import { extractTokenFromCookie, verifyToken } from "@/lib/auth/jwt";
import { CartItem } from "@/store/CartStore";
import { NextRequest, NextResponse } from "next/server";

// Simple in-memory store for cart data (in production, use a database)
const userCarts = new Map<string, CartItem[]>();

export async function GET(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get("cookie") ?? undefined;
    const token = extractTokenFromCookie(cookieHeader);

    // Return empty cart if not authenticated
    if (!token) {
      return NextResponse.json({ items: [] });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ items: [] });
    }

    // Return user's cart or empty array
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

    // Validate items array
    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: "Invalid items format" },
        { status: 400 }
      );
    }

    // Save cart for user
    userCarts.set(decoded.userId, items);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cart sync error:", error);
    return NextResponse.json({ error: "Failed to sync cart" }, { status: 500 });
  }
}

// DELETE endpoint to clear user's cart
export async function DELETE(request: NextRequest) {
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

    // Clear user's cart
    userCarts.delete(decoded.userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cart delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete cart" },
      { status: 500 }
    );
  }
}
