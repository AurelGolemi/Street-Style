import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log("\n🔐 ========== SUPABASE LOGIN START ========== 🔐");

    const body = await request.json();
    const { email, password } = body;

    console.log("📥 Fields extracted:", {
      email: email ? `✓ "${email}"` : "✗ missing",
      password: password ? `✓ (${password.length} chars)` : "✗ missing",
    });

    // Validate required fields
    if (!email || !password) {
      console.log("❌ VALIDATION FAILED: Email and password are required");
      console.log("🔐 ========== SUPABASE LOGIN END (ERROR) ========== 🔐\n");
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const supabase = await createServerSupabaseClient();

    console.log("🔐 Attempting Supabase sign in...");
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) {
      console.error("❌ SUPABASE AUTH ERROR:", authError.message);
      console.log("🔐 ========== SUPABASE LOGIN END (ERROR) ========== 🔐\n");
      return NextResponse.json(
        { error: authError.message || "Invalid credentials" },
        { status: 401 },
      );
    }

    if (!authData.user) {
      console.log("❌ USER NOT FOUND IN AUTH DATA");
      console.log("🔐 ========== SUPABASE LOGIN END (ERROR) ========== 🔐\n");
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    console.log("✓ Supabase authentication successful");

    // Fetch user profile data
    console.log("👤 Fetching user profile...");
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    if (profileError) {
      console.warn("⚠️ Profile fetch warning:", profileError.message);
    }

    const userData = {
      id: authData.user.id,
      email: authData.user.email!,
      firstName: profile?.first_name || "",
      lastName: profile?.last_name || "",
      phone: profile?.phone_number || "",
      role: profile?.role || "user",
      emailVerified: !!authData.user.email_confirmed_at,
    };

    console.log("✓ User profile retrieved");

    // Sync server components/UI
    revalidatePath("/", "layout");

    console.log("✅ SUPABASE LOGIN SUCCESS");
    console.log(
      "[LOGIN] Auth state listener should trigger SIGNED_IN event in client",
    );
    console.log("🔐 ========== SUPABASE LOGIN END (SUCCESS) ========== 🔐\n");

    // Session/cookies are handled by @supabase/ssr via middleware.
    return NextResponse.json(
      {
        success: true,
        user: userData,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("💥 LOGIN ERROR:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    console.error("💥 Error details:", errorMessage);
    console.log("🔐 ========== SUPABASE LOGIN END (ERROR) ========== 🔐\n");

    return NextResponse.json(
      { error: "An error occurred during login: " + errorMessage },
      { status: 500 },
    );
  }
}
