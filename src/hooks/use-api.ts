"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { useCallback } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://storekit.samarthh.me/v1";

export function useApi() {
  const { sessionId, isAuthenticated } = useAuth();

  const fetchWithAuth = useCallback(
    async <T = unknown>(endpoint: string, options: RequestInit = {}): Promise<T> => {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...options.headers,
      };

      if (sessionId) {
        (headers as Record<string, string>)["Authorization"] = `Bearer ${sessionId}`;
      }

      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `API Error: ${response.status}`);
      }

      return response.json();
    },
    [sessionId]
  );

  const get = useCallback(
    <T = unknown>(endpoint: string) => fetchWithAuth<T>(endpoint),
    [fetchWithAuth]
  );

  const post = useCallback(
    <T = unknown>(endpoint: string, data: unknown) =>
      fetchWithAuth<T>(endpoint, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    [fetchWithAuth]
  );

  const put = useCallback(
    <T = unknown>(endpoint: string, data: unknown) =>
      fetchWithAuth<T>(endpoint, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    [fetchWithAuth]
  );

  const del = useCallback(
    <T = unknown>(endpoint: string) =>
      fetchWithAuth<T>(endpoint, { method: "DELETE" }),
    [fetchWithAuth]
  );

  return {
    fetchWithAuth,
    get,
    post,
    put,
    del,
    sessionId,
    isAuthenticated,
  };
}
