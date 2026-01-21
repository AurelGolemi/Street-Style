import { userDb } from "@/data/db/users";
import { createSecureCookie, generateToken } from "@/lib/auth/jwt";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// Login API Route
export async function POST(request: NextRequest) {
  try {
    console.log("\n🔐 ========== LOGIN START ========== 🔐");

    // 1. Parse & validate input
    console.log("📋 Parsing request body...");
    const body = await request.json();
    const { email, password } = body;

    console.log("📥 Fields extracted:", {
      email: email ? `✓ "${email}"` : "✗ missing",
      password: password ? `✓ (${password.length} chars)` : "✗ missing",
    });

    // Validate required fields
    if (!email || !password) {
      console.log(
        "❌ VALIDATION FAILED: Email/phone and password are required",
      );
      console.log("🔐 ========== LOGIN END (ERROR) ========== 🔐\n");
      return NextResponse.json(
        { error: "Email/phone and password are required" },
        { status: 400 },
      );
    }
    console.log("✓ All required fields present");

    // 2. Find User
    console.log("🔍 Finding user...");
    // Try to find by email first
    let user = await userDb.findUserByEmail(email);
    console.log(
      user ? `✓ User found by email: ${user.id}` : "✗ Not found by email",
    );

    // If not found and looks like phone number, try phone lookup
    if (!user && /^\+?[\d\s\-()]+$/.test(email)) {
      console.log("📱 Input looks like phone number, trying phone lookup...");
      user = await userDb.findUserByPhone(email);
      console.log(
        user ? `✓ User found by phone: ${user.id}` : "✗ Not found by phone",
      );
    }

    // User not found
    if (!user) {
      console.log("❌ USER NOT FOUND");
      console.log("🔐 ========== LOGIN END (ERROR) ========== 🔐\n");
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    // 3. Check account lockout
    console.log("🔒 Checking account lockout status...");
    if (userDb.isAccountLocked(user)) {
      const lockUntil = user.lockUntil!;
      const minutesRemaining = Math.ceil(
        (lockUntil.getTime() - Date.now()) / 60000,
      );
      console.log(`❌ ACCOUNT LOCKED: ${minutesRemaining} minutes remaining`);
      console.log("🔐 ========== LOGIN END (ERROR) ========== 🔐\n");

      return NextResponse.json(
        {
          error: `Account is temporarily locked. Please try again in ${minutesRemaining} minutes.`,
          lockedUntil: lockUntil.toISOString(),
        },
        { status: 423 }, // 423 Locked
      );
    }
    console.log("✓ Account not locked");

    // 4. Verify Password
    console.log("🔑 Verifying password...");
    console.log("User password hash exists:", !!user.password_hash);
    console.log("User password hash length:", user.password_hash?.length || 0);

    const isValidPassword = await userDb.verifyPassword(user, password);
    console.log("Password verification result:", isValidPassword);

    if (!isValidPassword) {
      console.log("❌ PASSWORD VERIFICATION FAILED");
      console.log("Debug info:", {
        userId: user.id,
        email: user.email,
        hasPasswordHash: !!user.password_hash,
        passwordHashLength: user.password_hash?.length,
        inputPasswordLength: password.length,
      });
      await userDb.recordFailedLogin(user.id);
      console.log("📝 Failed login recorded");
      console.log("🔐 ========== LOGIN END (ERROR) ========== 🔐\n");

      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }
    console.log("✓ Password verified");

    // 5. Generate JWT Token
    console.log("🔑 Generating JWT token...");
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    console.log("✓ JWT token generated");

    // 6. Record successful login
    console.log("📝 Recording successful login...");
    await userDb.recordSuccessfulLogin(user.id);
    console.log("✓ Login recorded");

    // 7. Return Response With Secure Cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        emailVerified: user.emailVerified,
      },
    });

    // Set secure cookie
    response.headers.set("Set-Cookie", createSecureCookie(token));
    console.log("🍪 Secure cookie set in response headers");

    // Revalidate all pages to update auth state across the app
    revalidatePath("/", "layout");

    console.log("✅ LOGIN SUCCESS");
    console.log("🔐 ========== LOGIN END (SUCCESS) ========== 🔐\n");

    return response;
  } catch (error) {
    console.error("💥 LOGIN ERROR:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("💥 Error details:", errorMessage);
    console.log("🔐 ========== LOGIN END (ERROR) ========== 🔐\n");
    return NextResponse.json(
      { error: "An error occurred during login: " + errorMessage },
      { status: 500 },
    );
  }
}
