"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authAPI } from "@/lib/apiClients";
import { useAuth } from "@/components/providers/auth-provider";
import { Github, Loader2 } from "lucide-react";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#FFFFFF"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#FFFFFF"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FFFFFF"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#FFFFFF"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");

  const { setUserData } = useAuth();

  const [isChecking, setIsChecking] = useState(true);
  const [step, setStep] = useState<"EMAIL" | "OTP">("EMAIL");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(errorParam);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authAPI.getCurrentUser();
        if (response.success && response.data?.user) {
          setUserData(response.data.user);
          router.replace("/storentia/dashboard");
          return;
        }
      } catch (error) {
        console.log("[Login] Auth check error:", error);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [router, setUserData]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setInterval(() => setResendTimer((t) => t - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [resendTimer]);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSendOtp = async () => {
    setError(null);
    if (!email) {
      setError("Email is required");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authAPI.sendOtp(email);
      if (response.success) {
        setStep("OTP");
        setResendTimer(30); // 30 seconds cooldown
        // Automatically fill OTP for testing/demo if provided in response,
        // but traditionally we wouldn't unless it's dev env.
        // Given the request showed response with OTP, it might be returned.
        if (response.data?.otp) {
          console.log("OTP Received:", response.data.otp);
          // Optionally pre-fill for convenience if desired, but user didn't ask to prefill.
        }
      } else {
        setError(response.message || "Failed to send OTP");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError(null);
    if (!otp) {
      setError("OTP is required");
      return;
    }
    if (otp.length < 6) {
      setError("OTP must be 6 digits");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authAPI.verifyOtp(email, otp);
      if (response.success && response.data?.user) {
        setUserData(response.data.user);
        router.replace("/storentia/dashboard");
      } else {
        setError(response.message || "Invalid OTP");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    authAPI.initiateGoogleAuth();
  };

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen w-full bg-background overflow-hidden font-sans">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 dark:bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-secondary/80 dark:bg-secondary/20 rounded-full blur-[100px]" />

      <div className="relative z-10 w-full max-w-[420px] p-8 mx-4">
        {/* Card Container */}
        <div className="absolute inset-0 bg-card/80 backdrop-blur-xl rounded-3xl border border-border/50 shadow-xl" />

        <div className="relative z-20 flex flex-col items-center">
          <h1 className="font-playfair text-4xl text-foreground font-medium mb-2 tracking-tight text-center mt-4">
            {step === "EMAIL" ? "Welcome Back" : "Verify Email"}
          </h1>
          <p className="text-muted-foreground text-center mb-10 text-sm">
            {step === "EMAIL"
              ? "Enter your email to sign in or create an account"
              : `We sent a code to ${email}`}
          </p>

          <div className="w-full space-y-6">
            {step === "EMAIL" ? (
              /* Email Input Step */
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground font-medium ml-1">
                    Email address
                  </label>
                  <div className="relative group">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                      placeholder="you@example.com"
                      className="w-full bg-background text-foreground border border-input rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground/60"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {error && (
                  <div className="text-xs text-red-500 ml-1 font-medium">
                    {error}
                  </div>
                )}

                <Button
                  className="w-full h-12 rounded-xl text-base font-medium"
                  onClick={handleSendOtp}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    "Continue with Email"
                  )}
                </Button>
              </div>
            ) : (
              /* OTP Input Step */
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground font-medium ml-1">
                    Enter OTP
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => {
                        // Only allow numbers
                        const val = e.target.value.replace(/\D/g, "");
                        if (val.length <= 6) setOtp(val);
                      }}
                      onKeyDown={(e) => e.key === "Enter" && handleVerifyOtp()}
                      placeholder="000000"
                      className="w-full bg-background text-foreground border border-input rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground/60 tracking-widest text-center text-lg"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {error && (
                  <div className="text-xs text-red-500 ml-1 font-medium text-center">
                    {error}
                  </div>
                )}

                <Button
                  className="w-full h-12 rounded-xl text-base font-medium"
                  onClick={handleVerifyOtp}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify & Login"
                  )}
                </Button>

                <div className="flex items-center justify-between text-xs mt-4">
                  <button
                    onClick={() => setStep("EMAIL")}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isLoading}
                  >
                    Change Email
                  </button>
                  <button
                    onClick={handleSendOtp}
                    className={`font-medium transition-colors ${
                      resendTimer > 0
                        ? "text-muted-foreground cursor-not-allowed"
                        : "text-primary hover:text-primary/80"
                    }`}
                    disabled={isLoading || resendTimer > 0}
                  >
                    {resendTimer > 0
                      ? `Resend in ${resendTimer}s`
                      : "Resend OTP"}
                  </button>
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  or Sign in with
                </span>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-12 bg-background border-border hover:bg-accent hover:text-accent-foreground rounded-full gap-2 transition-all"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <GoogleIcon className="w-5 h-5" />
                Google
              </Button>
              <Button
                variant="outline"
                className="h-12 bg-background border-border hover:bg-accent hover:text-accent-foreground rounded-full gap-2 transition-all opacity-50 cursor-not-allowed"
                disabled
              >
                <Github className="w-5 h-5" />
                Github
              </Button>
            </div>

            {/* Footer */}
            <div className="space-y-4 text-center pt-4">
              <div className="text-[10px] text-muted-foreground leading-tight px-4">
                By signing up, you agree to the{" "}
                <span className="text-foreground hover:underline cursor-pointer">
                  Terms of Service
                </span>
                .
                <br />
                You agree to receive our emails.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
