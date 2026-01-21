"use client";

import { useCartStore } from "@/store/CartStore";
import { useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface User {
  phone: string;
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "user" | "admin";
  emailVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

interface RegisterData {
  email: string;
  phone?: string;
  password: string;
  firstName: string;
  lastName: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();

    // Check auth on focus/visibility changes to handle cross-device sessions
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkAuth();
      }
    };

    // Also check on window focus for better cross-device sync
    const handleWindowFocus = () => {
      checkAuth();
    };

    window.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleWindowFocus);
    return () => {
      window.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, []);

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);

        // Initialize / merge cart for this user
        try {
          useCartStore.getState().initializeCart(data.user?.id ?? null);
        } catch (e) {
          console.error("Cart initialization failed:", e);
        }
      } else {
        setUser(null);
        // Ensure cart cleared for unauthenticated users
        useCartStore.getState().initializeCart(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Immediately update client-side user so UI reflects auth state without reload
      setUser(data.user ?? null);
      try {
        useCartStore.getState().initializeCart(data.user?.id ?? null);
      } catch (e) {
        console.error("Cart initialization failed after login:", e);
      }

      // Redirect client-side; new page load will also pick up cookies for SSR
      router.push("/");
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Registration failed");
      }

      // Immediately update client-side user so UI reflects auth state without reload
      setUser(responseData.user ?? null);
      try {
        useCartStore.getState().initializeCart(responseData.user?.id ?? null);
      } catch (e) {
        console.error("Cart initialization failed after register:", e);
      }

      // Redirect client-side; new page load will also pick up cookies for SSR
      router.push("/");
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      // Immediately clear client-side user so UI reflects logged-out state
      setUser(null);
      try {
        useCartStore.getState().initializeCart(null);
      } catch (e) {
        console.error("Cart clear failed after logout:", e);
      }

      // Redirect to login
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Still navigate on error
      router.push("/login");
    }
  };

  const refreshUser = async () => {
    await checkAuth();
  };

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
