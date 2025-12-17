"use server";

export async function getUser() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/me`,
      {
        credentials: "include",
      }
    );

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
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm_password") as string;
    const full_name = formData.get("full_name") as string;
    const phone_number = formData.get("phone_number") as string;
    const [firstName, lastName] = full_name ? full_name.split(" ") : ["", ""];

    if (!email || !password) {
      return { error: "Email and password are required" };
    }

    if (password.length < 8) {
      return { error: "Password must be at least 8 characters" };
    }

    // Call your API route instead of Supabase
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
          confirmPassword,
          firstName: firstName || "User",
          lastName: lastName || "",
          phone: phone_number,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || "Registration failed" };
    }

    return {
      success: true,
      message: "Account created! Redirecting to login...",
    };
  } catch (error) {
    console.error("Signup error:", error);
    return { error: "An unexpected error occurred" };
  }
}

export async function signIn(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return { error: "Email and password are required" };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || "Login failed" };
    }

    // Success - user will be redirected by client
    return { success: true, user: data.user };
  } catch (error) {
    console.error("Signin error:", error);
    return { error: "An unexpected error occurred" };
  }
}

export async function signOut() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/logout`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    return response.ok ? { success: true } : { error: "Logout failed" };
  } catch (error) {
    console.error("Signout error:", error);
    return { error: "Logout failed" };
  }
}
