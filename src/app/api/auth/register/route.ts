import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log("\n🔐 ========== SUPABASE REGISTER START ========== 🔐");

    const body = await request.json();
    const { email, password, confirmPassword, firstName, lastName } = body;

    console.log("📥 Fields extracted:", {
      email: email ? `✓ "${email}"` : "✗ missing",
      password: password ? `✓ (${password.length} chars)` : "✗ missing",
      confirmPassword: confirmPassword
        ? `✓ (${confirmPassword.length} chars)`
        : "✗ missing",
      firstName: firstName ? `✓ "${firstName}"` : "✗ missing",
      lastName: lastName ? `✓ "${lastName}"` : "✗ missing",
    });

    // Validate required fields
    if (!email || !password || !confirmPassword || !firstName || !lastName) {
      console.log("❌ VALIDATION FAILED: All fields are required");
      console.log(
        "🔐 ========== SUPABASE REGISTER END (ERROR) ========== 🔐\n",
      );
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log(`❌ EMAIL FORMAT INVALID: "${email}" does not match regex`);
      console.log(
        "🔐 ========== SUPABASE REGISTER END (ERROR) ========== 🔐\n",
      );
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password strength
    if (password.length < 8) {
      console.log(`❌ PASSWORD LENGTH: "${password.length}" chars, needs 8+`);
      console.log(
        "🔐 ========== SUPABASE REGISTER END (ERROR) ========== 🔐\n",
      );
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 },
      );
    }

    if (!/[A-Z]/.test(password)) {
      console.log("❌ PASSWORD MISSING: Uppercase letter");
      console.log(
        "🔐 ========== SUPABASE REGISTER END (ERROR) ========== 🔐\n",
      );
      return NextResponse.json(
        { error: "Password must contain at least one uppercase letter" },
        { status: 400 },
      );
    }

    if (!/[a-z]/.test(password)) {
      console.log("❌ PASSWORD MISSING: Lowercase letter");
      console.log(
        "🔐 ========== SUPABASE REGISTER END (ERROR) ========== 🔐\n",
      );
      return NextResponse.json(
        { error: "Password must contain at least one lowercase letter" },
        { status: 400 },
      );
    }

    if (!/\d/.test(password)) {
      console.log("❌ PASSWORD MISSING: Number");
      console.log(
        "🔐 ========== SUPABASE REGISTER END (ERROR) ========== 🔐\n",
      );
      return NextResponse.json(
        { error: "Password must contain at least one number" },
        { status: 400 },
      );
    }

    // Validate password match
    if (password !== confirmPassword) {
      console.log("❌ PASSWORD MISMATCH: passwords do not match");
      console.log(
        "🔐 ========== SUPABASE REGISTER END (ERROR) ========== 🔐\n",
      );
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 },
      );
    }

    // Validate name lengths
    if (
      firstName.trim().length === 0 ||
      firstName.length > 50 ||
      lastName.trim().length === 0 ||
      lastName.length > 50
    ) {
      console.log("❌ NAME LENGTH INVALID");
      console.log(
        "🔐 ========== SUPABASE REGISTER END (ERROR) ========== 🔐\n",
      );
      return NextResponse.json(
        { error: "First and last name must be between 1 and 50 characters" },
        { status: 400 },
      );
    }

    // Create Supabase client
    const supabase = await createServerSupabaseClient();

    // Sign up with Supabase
    console.log("🔐 Attempting Supabase sign up...");
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    if (authError) {
      console.error("❌ SUPABASE AUTH ERROR:", authError.message);
      console.log(
        "🔐 ========== SUPABASE REGISTER END (ERROR) ========== 🔐\n",
      );
      return NextResponse.json(
        { error: authError.message || "Registration failed" },
        { status: 400 },
      );
    }

    if (!authData.user) {
      console.log("❌ USER NOT CREATED");
      console.log(
        "🔐 ========== SUPABASE REGISTER END (ERROR) ========== 🔐\n",
      );
      return NextResponse.json(
        { error: "Registration failed" },
        { status: 400 },
      );
    }

    console.log("✓ Supabase account created");

    // Fetch or wait for profile to be created (trigger should create it)
    console.log("👤 Fetching user profile...");
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    const userData = {
      id: authData.user.id,
      email: authData.user.email!,
      firstName: profile?.first_name || firstName,
      lastName: profile?.last_name || lastName,
      phone: profile?.phone_number || "",
      role: profile?.role || "user",
      emailVerified: !!authData.user.email_confirmed_at,
    };

    console.log("✓ User profile retrieved");

    // Revalidate all pages to update auth state across the app
    revalidatePath("/", "layout");

    console.log("✅ SUPABASE REGISTRATION SUCCESS");
    console.log(
      "🔐 ========== SUPABASE REGISTER END (SUCCESS) ========== 🔐\n",
    );

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        user: userData,
      },
      { status: 201 },
    );

    // Get the updated cookies from the cookie store and set them in the response
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();

    // Debug: Log all cookies to be set
    console.log("[REGISTER] Setting cookies in response:", allCookies);

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
    console.error("💥 REGISTRATION ERROR:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("💥 Error details:", errorMessage);
    console.log("🔐 ========== SUPABASE REGISTER END (ERROR) ========== 🔐\n");
    return NextResponse.json(
      { error: "An error occurred during registration: " + errorMessage },
      { status: 500 },
    );
  }
}
