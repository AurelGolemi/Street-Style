import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
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

    const supabase = await createServerSupabaseClient();

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

    revalidatePath("/", "layout");

    console.log("✅ SUPABASE REGISTRATION SUCCESS");
    console.log(
      "🔐 ========== SUPABASE REGISTER END (SUCCESS) ========== 🔐\n",
    );

    // Return user. Session/cookies handled by @supabase/ssr via middleware.
    return NextResponse.json(
      {
        success: true,
        user: userData,
      },
      { status: 201 },
    );
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
