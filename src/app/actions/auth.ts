"use server";

export async function getUser() {
  try {
    const response = await fetch("/api/auth/me", {
      credentials: "include",
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.user || null;
  } catch (error) {
    console.error("Get user error:", error);
    return null;
  }
}

export async function signUp(formData: FormData) {
  try {
    // Extract form values
    const email = formData.get("email") as string | null;
    const password = formData.get("password") as string | null;
    const confirmPassword = formData.get("confirm_password") as string | null;
    const full_name = formData.get("full_name") as string | null;
    const phone_number = formData.get("phone_number") as string | null;

    // Log extracted values for debugging
    console.log("📋 Form data extracted:", {
      email: email ? "✓" : "✗ MISSING",
      password: password ? "✓" : "✗ MISSING",
      confirmPassword: confirmPassword ? "✓" : "✗ MISSING",
      full_name: full_name ? "✓" : "✗ MISSING",
      phone_number: phone_number ? "✓ (optional)" : "- (optional)",
    });

    // Split full name
    const [firstName, lastName] = full_name
      ? full_name.trim().split(" ")
      : ["", ""];

    console.log("📝 Parsed names:", { firstName, lastName });

    // Client-side validation
    if (!email?.trim()) {
      console.error("❌ Validation failed: Email is empty");
      return { error: "Email is required" };
    }

    if (!password?.trim()) {
      console.error("❌ Validation failed: Password is empty");
      return { error: "Password is required" };
    }

    if (!confirmPassword?.trim()) {
      console.error("❌ Validation failed: Confirm password is empty");
      return { error: "Please confirm your password" };
    }

    if (!firstName?.trim()) {
      console.error("❌ Validation failed: Full name is required");
      return { error: "Full name is required" };
    }

    if (password.length < 8) {
      console.error("❌ Validation failed: Password too short");
      return { error: "Password must be at least 8 characters" };
    }

    if (password !== confirmPassword) {
      console.error("❌ Validation failed: Passwords don't match");
      return { error: "Passwords do not match" };
    }

    const payload = {
      email: email.trim(),
      password,
      confirmPassword,
      firstName: firstName.trim(),
      lastName: lastName?.trim() || "",
      phone: phone_number?.trim() || undefined,
    };

    console.log("🚀 Sending registration request:", {
      url: "/api/auth/register",
      payload: {
        ...payload,
        password: "***",
        confirmPassword: "***",
      },
    });

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    console.log("📥 Registration response:", {
      status: response.status,
      statusText: response.statusText,
      error: data.error,
      success: data.success,
    });

    if (!response.ok) {
      console.error("❌ Registration failed:", data.error);
      return { error: data.error || "Registration failed" };
    }

    console.log("✅ Registration successful");
    return {
      success: true,
      message: "Account created! Redirecting to login...",
    };
  } catch (error) {
    console.error("💥 Signup exception:", error);
    return {
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function signIn(formData: FormData) {
  try {
    const email = formData.get("email") as string | null;
    const password = formData.get("password") as string | null;

    console.log("📋 Login form data extracted:", {
      email: email ? "✓" : "✗ MISSING",
      password: password ? "✓" : "✗ MISSING",
    });

    if (!email?.trim() || !password?.trim()) {
      console.error("❌ Validation failed: Email or password is empty");
      return { error: "Email and password are required" };
    }

    console.log("🚀 Sending login request:", {
      url: "/api/auth/login",
      email: email.trim(),
    });

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email: email.trim(), password }),
    });

    const data = await response.json();

    console.log("📥 Login response:", {
      status: response.status,
      statusText: response.statusText,
      error: data.error,
      success: data.success,
      user: data.user ? "✓ User returned" : "✗ No user",
    });

    if (!response.ok) {
      console.error("❌ Login failed:", data.error);
      return { error: data.error || "Login failed" };
    }

    console.log("✅ Login successful");
    return { success: true, user: data.user };
  } catch (error) {
    console.error("💥 Signin exception:", error);
    return {
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function signOut() {
  try {
    console.log("🚀 Sending logout request");

    const response = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      console.log("✅ Logout successful");
      return { success: true };
    } else {
      console.error("❌ Logout failed");
      return { error: "Logout failed" };
    }
  } catch (error) {
    console.error("💥 Signout exception:", error);
    return { error: "Logout failed" };
  }
}
