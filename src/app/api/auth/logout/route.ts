import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    console.log("\n🔐 ========== SUPABASE LOGOUT START ========== 🔐");

    const supabase = await createServerSupabaseClient();

    // Sign out with Supabase
    console.log("🔐 Attempting Supabase sign out...");
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("❌ SUPABASE LOGOUT ERROR:", error.message);
      console.log("🔐 ========== SUPABASE LOGOUT END (ERROR) ========== 🔐\n");
      return NextResponse.json(
        { error: error.message || "Logout failed" },
        { status: 400 }
      );
    }

    console.log("✓ Supabase sign out successful");

    // Revalidate all pages to clear cached user data
    revalidatePath("/", "layout");

    console.log("✅ SUPABASE LOGOUT SUCCESS");
    console.log("🔐 ========== SUPABASE LOGOUT END (SUCCESS) ========== 🔐\n");

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("💥 LOGOUT ERROR:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("💥 Error details:", errorMessage);
    console.log("🔐 ========== SUPABASE LOGOUT END (ERROR) ========== 🔐\n");
    return NextResponse.json(
      { error: "An error occurred during logout: " + errorMessage },
      { status: 500 }
    );
  }
}
  }
}
