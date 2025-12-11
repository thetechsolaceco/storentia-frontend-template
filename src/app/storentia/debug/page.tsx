"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || "https://storekit.samarthh.me/v1";
const PROXY_API_URL = "/api/backend";

export default function DebugPage() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const testDirectApi = async () => {
    setLoading(true);
    setResult("");
    try {
      console.log("[Debug] Testing direct API:", `${BACKEND_API_URL}/user/@me`);
      console.log("[Debug] Cookies:", document.cookie);
      
      const response = await fetch(`${BACKEND_API_URL}/user/@me`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json().catch(() => null);
      
      setResult(JSON.stringify({
        type: "Direct API",
        url: `${BACKEND_API_URL}/user/@me`,
        status: response.status,
        cookies: document.cookie,
        data,
      }, null, 2));
    } catch (error) {
      setResult(`Direct API Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testProxyApi = async () => {
    setLoading(true);
    setResult("");
    try {
      console.log("[Debug] Testing proxy API:", `${PROXY_API_URL}/user/@me`);
      console.log("[Debug] Cookies:", document.cookie);
      
      const response = await fetch(`${PROXY_API_URL}/user/@me`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json().catch(() => null);
      
      setResult(JSON.stringify({
        type: "Proxy API",
        url: `${PROXY_API_URL}/user/@me`,
        status: response.status,
        cookies: document.cookie,
        data,
      }, null, 2));
    } catch (error) {
      setResult(`Proxy API Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const showCookies = () => {
    setResult(JSON.stringify({
      cookies: document.cookie,
      localStorage: {
        storentia_user: localStorage.getItem("storentia_user"),
        storentia_api_key: localStorage.getItem("storentia_api_key"),
        storentia_store: localStorage.getItem("storentia_store"),
      },
    }, null, 2));
  };

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Auth Debug</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button onClick={testDirectApi} disabled={loading}>
              Test Direct API
            </Button>
            <Button onClick={testProxyApi} disabled={loading}>
              Test Proxy API
            </Button>
            <Button variant="outline" onClick={showCookies}>
              Show Cookies
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = `${BACKEND_API_URL}/auth/google`}
            >
              Login with Google
            </Button>
          </div>
          
          {result && (
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto max-h-96">
              {result}
            </pre>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
