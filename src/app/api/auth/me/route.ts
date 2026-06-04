// app/api/auth/me/route.ts
// ENHANCED VERSION - Replace your existing file with this

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();

    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
      console.log("[AUTH ME] No user session found");
      return NextResponse.json({ user: null });
    }

    console.log("[AUTH ME] User found:", authUser.id);

    // NEW: Fetch profile data from user_profiles table
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", authUser.id)
      .single();

    // NEW: Return enhanced user object with profile data
    const userData = {
      id: authUser.id,
      email: authUser.email!,
      firstName: profile?.first_name || "",
      lastName: profile?.last_name || "",
      phone: profile?.phone_number || "",
      role: profile?.role || "user",
      emailVerified: !!authUser.email_confirmed_at,
    };

    console.log("[AUTH ME] Returning user data for:", userData.email);

    return NextResponse.json(
      {
        user: userData,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      },
    );
  } catch (error) {
    console.error("[Auth Check] Error:", error);
    return NextResponse.json({ user: null });
  }
}
