"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { PublicUser, SigninRequest, SignupRequest, AuthResponse } from "../types/user";

interface AuthContextType {
  user: PublicUser | null;
  isLoading: boolean;
  signIn: (credentials: SigninRequest) => Promise<{ success: boolean; error?: string }>;
  signUp: (data: SignupRequest) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me");
      const data: AuthResponse = await response.json();
      
      if (data.success && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const signIn = useCallback(async (credentials: SigninRequest) => {
    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data: AuthResponse = await response.json();

      if (data.success && data.user) {
        setUser(data.user);
        router.push("/");
        return { success: true };
      } else {
        return { success: false, error: data.error || "Sign in failed" };
      }
    } catch (error) {
      console.error("Sign in error:", error);
      return { success: false, error: "An error occurred during sign in" };
    }
  }, [router]);

  const signUp = useCallback(async (data: SignupRequest) => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result: AuthResponse = await response.json();

      if (result.success && result.user) {
        setUser(result.user);
        router.push("/");
        return { success: true };
      } else {
        return { success: false, error: result.error || "Sign up failed" };
      }
    } catch (error) {
      console.error("Sign up error:", error);
      return { success: false, error: "An error occurred during sign up" };
    }
  }, [router]);

  const signOut = useCallback(async () => {
    try {
      await fetch("/api/auth/signout", {
        method: "POST",
      });
      setUser(null);
      router.push("/signin");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  }, [router]);

  const refreshUser = useCallback(async () => {
    await fetchUser();
  }, [fetchUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

