"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://storekit.samarthh.me/v1";

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      console.log("[AuthProvider] Fetching user from:", `${API_URL}/user/@me`);
      console.log("[AuthProvider] Current cookies:", document.cookie);
      
      const response = await fetch(`${API_URL}/user/@me`, {
        credentials: "include",
      });

      console.log("[AuthProvider] Response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("[AuthProvider] User data:", data);
        const userData = data.user || data;
        setUser(userData);
      } else {
        console.log("[AuthProvider] Not authenticated, status:", response.status);
        setUser(null);
      }
    } catch (error) {
      console.error("[AuthProvider] Error fetching user:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const logout = async () => {
    try {
      console.log("[AuthProvider] Logging out...");
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      window.location.href = "/storentia/login";
    } catch (error) {
      console.error("[AuthProvider] Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
