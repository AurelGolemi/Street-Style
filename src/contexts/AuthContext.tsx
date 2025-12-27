"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useCartStore } from "@/store/CartStore"

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

      setUser(data.user);

      // Load cart from server for this user
      if (typeof window !== "undefined") {
        const { useCartStore } = await import("@/store/CartStore");
        useCartStore.getState().loadFromServer();
      }

      router.push("/");
      router.refresh();
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

      setUser(responseData.user);

      // Initialize cart for new user
      if (typeof window !== "undefined") {
        const { useCartStore } = await import("@/store/CartStore");
        useCartStore.getState().loadFromServer();
      }

      router.push("/");
      router.refresh();
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
      setUser(null);
      useCartStore.getState().initializeCart(null);
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
      setUser(null);
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
