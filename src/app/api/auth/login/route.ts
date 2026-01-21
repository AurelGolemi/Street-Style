import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
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

    // Create Supabase client
    const supabase = await createServerSupabaseClient();

    // Sign in with Supabase
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

    // Return user data
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

    // Revalidate all pages to update auth state across the app
    revalidatePath("/", "layout");

    console.log("✅ SUPABASE LOGIN SUCCESS");
    console.log("🔐 ========== SUPABASE LOGIN END (SUCCESS) ========== 🔐\n");

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        user: userData,
      },
      { status: 200 },
    );

    // Get the updated cookies from the cookie store and set them in the response
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();

    // Debug: Log all cookies to be set
    console.log("[LOGIN] Setting cookies in response:", allCookies);

    // Set all Supabase-related cookies in the response
    allCookies.forEach((cookie) => {
      response.cookies.set(cookie.name, cookie.value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365, // 1 year
      });
    });

    return response;
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
