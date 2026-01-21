import { userDb } from "@/data/db/users";
import { createSecureCookie, generateToken } from "@/lib/auth/jwt";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// Register API Route
export async function POST(request: NextRequest) {
  try {
    console.log("\n🔐 ========== REGISTER START ========== 🔐");

    // 1. Parse Input
    console.log("📋 Parsing request body...");
    const body = await request.json();
    const { email, phone, password, confirmPassword, firstName, lastName } =
      body;

    console.log("📥 Fields extracted:", {
      email: email ? `✓ "${email}"` : "✗ missing",
      phone: phone ? `✓ "${phone}"` : "✗ empty",
      password: password ? `✓ (${password.length} chars)` : "✗ missing",
      confirmPassword: confirmPassword
        ? `✓ (${confirmPassword.length} chars)`
        : "✗ missing",
      firstName: firstName ? `✓ "${firstName}"` : "✗ missing",
      lastName: lastName ? `✓ "${lastName}"` : "✗ missing",
    });

    // 2. Validate Required Fields
    if (!email) {
      console.log("❌ EMAIL VALIDATION FAILED: Email is required");
      console.log("🔐 ========== REGISTER END (ERROR) ========== 🔐\n");
      return NextResponse.json(
        { error: "Email is required", field: "email" },
        { status: 400 },
      );
    }

    if (!password) {
      console.log("❌ PASSWORD VALIDATION FAILED: Password is required");
      console.log("🔐 ========== REGISTER END (ERROR) ========== 🔐\n");
      return NextResponse.json(
        { error: "Password is required", field: "password" },
        { status: 400 },
      );
    }

    if (!confirmPassword) {
      console.log(
        "❌ CONFIRM PASSWORD VALIDATION FAILED: Please confirm your password",
      );
      console.log("🔐 ========== REGISTER END (ERROR) ========== 🔐\n");
      return NextResponse.json(
        { error: "Please confirm your password", field: "confirmPassword" },
        { status: 400 },
      );
    }

    if (!firstName || !lastName) {
      console.log(
        "❌ NAME VALIDATION FAILED: First and last name are required",
      );
      console.log("🔐 ========== REGISTER END (ERROR) ========== 🔐\n");
      return NextResponse.json(
        { error: "First and last name are required", field: "firstName" },
        { status: 400 },
      );
    }
    console.log("✓ All required fields present");

    // 3. Validate Email Format
    console.log("📧 Validating email format...");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log(`❌ EMAIL FORMAT INVALID: "${email}" does not match regex`);
      console.log("🔐 ========== REGISTER END (ERROR) ========== 🔐\n");
      return NextResponse.json(
        { error: "Invalid email format", field: "email" },
        { status: 400 },
      );
    }
    console.log("✓ Email format valid");

    // 4. If provided, validate phone format
    if (phone) {
      console.log("📱 Validating phone format...");
      // Remove all non-digit characters
      const digitsOnly = phone.replace(/\D/g, "");

      // Check if valid length (10-15 digits)
      if (digitsOnly.length < 10 || digitsOnly.length > 15) {
        console.log(
          `❌ PHONE FORMAT INVALID: "${phone}" has ${digitsOnly.length} digits`,
        );
        console.log("🔐 ========== REGISTER END (ERROR) ========== 🔐\n");
        return NextResponse.json(
          { error: "Invalid phone number format", field: "phone" },
          { status: 400 },
        );
      }
      console.log("✓ Phone format valid");
    }

    // 5. Validate Password Strength
    console.log("🔒 Validating password strength...");
    if (password.length < 8) {
      console.log(`❌ PASSWORD LENGTH: "${password.length}" chars, needs 8+`);
      console.log("🔐 ========== REGISTER END (ERROR) ========== 🔐\n");
      return NextResponse.json(
        {
          error: "Password must be at least 8 characters long",
          field: "password",
        },
        { status: 400 },
      );
    }

    // Check for uppercase letter
    if (!/[A-Z]/.test(password)) {
      console.log("❌ PASSWORD MISSING: Uppercase letter");
      console.log("🔐 ========== REGISTER END (ERROR) ========== 🔐\n");
      return NextResponse.json(
        {
          error: "Password must contain at least one uppercase letter",
          field: "password",
        },
        { status: 400 },
      );
    }

    // Check for lowercase letter
    if (!/[a-z]/.test(password)) {
      console.log("❌ PASSWORD MISSING: Lowercase letter");
      console.log("🔐 ========== REGISTER END (ERROR) ========== 🔐\n");
      return NextResponse.json(
        {
          error: "Password must contain at least one lowercase letter",
          field: "password",
        },
        { status: 400 },
      );
    }

    // Check for number
    if (!/\d/.test(password)) {
      console.log("❌ PASSWORD MISSING: Number");
      console.log("🔐 ========== REGISTER END (ERROR) ========== 🔐\n");
      return NextResponse.json(
        {
          error: "Password must contain at least one number",
          field: "password",
        },
        { status: 400 },
      );
    }
    console.log("✓ Password strength valid");

    // Validate Password Match
    if (password !== confirmPassword) {
      console.log("❌ PASSWORD MISMATCH: passwords do not match");
      console.log("🔐 ========== REGISTER END (ERROR) ========== 🔐\n");
      return NextResponse.json(
        { error: "Passwords do not match", field: "confirmPassword" },
        { status: 400 },
      );
    }
    console.log("✓ Passwords match");

    // 7. Validate Name Length
    console.log("📝 Validating name lengths...");
    if (firstName.trim().length === 0 || firstName.length > 50) {
      console.log(
        `❌ FIRST NAME LENGTH: "${firstName.length}" chars, needs 1-50`,
      );
      console.log("🔐 ========== REGISTER END (ERROR) ========== 🔐\n");
      return NextResponse.json(
        {
          error: "First name must be between 1 and 50 characters",
          field: "firstName",
        },
        { status: 400 },
      );
    }

    if (lastName.trim().length === 0 || lastName.length > 50) {
      console.log(
        `❌ LAST NAME LENGTH: "${lastName.length}" chars, needs 1-50`,
      );
      console.log("🔐 ========== REGISTER END (ERROR) ========== 🔐\n");
      return NextResponse.json(
        {
          error: "Last name must be between 1 and 50 characters",
          field: "lastName",
        },
        { status: 400 },
      );
    }
    console.log("✓ Name lengths valid");

    // 8. Create User
    console.log("👤 Creating user in database...");
    console.log("Password to hash:", password.substring(0, 3) + "***");
    try {
      const user = await userDb.createUser({
        email,
        phone: phone || undefined,
        password,
        firstName,
        lastName,
      });

      console.log("✅ User created successfully:", {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        hasPasswordHash: !!user.password_hash,
        passwordHashLength: user.password_hash?.length || 0,
      });

      // Generate JWT Token (auto-login after registration)
      console.log("🔑 Generating JWT token...");
      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });
      console.log("✓ JWT token generated");

      // 10. Return Success with secure cookie
      const response = NextResponse.json(
        {
          success: true,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            emailVerified: user.emailVerified,
          },
        },
        { status: 201 },
      );

      response.headers.set("Set-Cookie", createSecureCookie(token));
      console.log("🍪 Secure cookie set in response headers");

      // Revalidate all pages to update auth state across the app
      revalidatePath("/", "layout");

      console.log("✅ REGISTRATION SUCCESS");
      console.log("🔐 ========== REGISTER END (SUCCESS) ========== 🔐\n");
      return response;
    } catch (error) {
      // Handle database errors
      if (error instanceof Error) {
        if (error.message.includes("Email already registered")) {
          console.log(`❌ USER CREATION FAILED: Email already registered`);
          console.log("🔐 ========== REGISTER END (ERROR) ========== 🔐\n");
          return NextResponse.json(
            { error: "This email is already registered", field: "email" },
            { status: 400 },
          );
        }
        if (error.message.includes("Phone number already registered")) {
          console.log(
            `❌ USER CREATION FAILED: Phone number already registered`,
          );
          console.log("🔐 ========== REGISTER END (ERROR) ========== 🔐\n");
          return NextResponse.json(
            {
              error: "This phone number is already registered",
              field: "phone",
            },
            { status: 400 },
          );
        }
      }
      throw error;
    }
  } catch (error) {
    console.error("💥 REGISTRATION ERROR:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("💥 Error details:", errorMessage);
    console.log("🔐 ========== REGISTER END (ERROR) ========== 🔐\n");
    return NextResponse.json(
      { error: "An error occurred during registration: " + errorMessage },
      { status: 500 },
    );
  }
}
