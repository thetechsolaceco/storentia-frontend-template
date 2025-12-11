"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function OAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    console.log("[OAuth Callback] Page loaded");
    console.log("[OAuth Callback] Search params:", Object.fromEntries(searchParams.entries()));
    console.log("[OAuth Callback] Cookies:", document.cookie);
    
    // After OAuth, the backend should have set the sessionId cookie
    // Redirect to dashboard
    router.replace("/storentia/dashboard");
  }, [router, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
}
