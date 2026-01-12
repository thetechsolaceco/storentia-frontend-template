'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { sendOtp, verifyOtp } from '@/lib/apiClients/store/authentication';
import { addMultipleToCart } from '@/lib/apiClients';

const CART_STORAGE_KEY = "storentia_cart";

// Sync local cart to server and clear local storage
async function syncLocalCartToServer(): Promise<void> {
  if (typeof window === 'undefined') return;
  
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return;
    
    const localItems = JSON.parse(stored);
    if (!localItems || localItems.length === 0) return;
    
    // Transform local cart items to API format
    const items = localItems.map((item: any) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));
    
    // Try to sync to server (don't wait for success)
    try {
      await addMultipleToCart({ items });
    } catch (error) {
      console.warn('Cart sync API failed:', error);
    }
  } catch (error) {
    console.error('Error parsing cart:', error);
  } finally {
    // Always clear local cart after login/signup
    localStorage.removeItem(CART_STORAGE_KEY);
    window.dispatchEvent(new Event('cart-update'));
  }
}

function LoginPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [storeConfigured, setStoreConfigured] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  useEffect(() => {
    const storeId = process.env.NEXT_PUBLIC_STORENTIA_STOREID;
    if (storeId) {
      setStoreConfigured(true);
    } else {
      setError('Store ID not configured');
    }
    setChecking(false);
  }, []);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!storeConfigured) {
      setError('Store configuration required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await sendOtp({ email });
      
      if (result.success) {
        setStep('otp');
      } else {
        setError(result.error || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      setError('An error occurred while sending OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await verifyOtp({ email, otp });
      
      if (result.success) {
        // Sync local cart to server after successful login
        await syncLocalCartToServer();
        
        window.dispatchEvent(new Event('auth-change'));
        router.push(redirectUrl);
        router.refresh();
      } else {
        setError(result.error || 'Invalid OTP');
      }
    } catch (error) {
      setError('An error occurred while verifying OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep('email');
    setOtp('');
    setError('');
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-black" />
      </div>
    );
  }

  if (!storeConfigured) {
    return (
      <div className="flex items-center justify-center min-h-screen">
          <p className="text-red-500">Store configuration missing</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Side - Editorial Image (Desktop Only) */}
      <div className="hidden lg:block w-1/2 relative bg-black">
         <div className="absolute inset-0 opacity-60 bg-black z-10" />
         <Image 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" 
            alt="Editorial" 
            fill 
            className="object-cover" 
            priority
         />
         <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white p-12 text-center">
            <h2 className="text-5xl font-black uppercase tracking-tight mb-6">Milan Fashion</h2>
            <p className="text-lg font-light tracking-widest uppercase max-w-md leading-relaxed">
              "Elegance is not standing out, but being remembered."
            </p>
         </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24">
         <div className="w-full max-w-md space-y-12">
            
            {/* Header */}
            <div className="space-y-2 text-center lg:text-left">
               <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
                 {step === 'email' ? 'Welcome Back' : 'Verify Access'}
               </h1>
               <p className="text-gray-500 text-sm font-medium uppercase tracking-widest">
                  {step === 'email' ? 'Enter your details to access your account' : 'Enter the code sent to your email'}
               </p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wide border-l-2 border-red-500">
                {error}
              </div>
            )}

            {step === 'email' ? (
              <form onSubmit={handleSendOtp} className="space-y-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-gray-900">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      className="border-0 border-b border-gray-200 rounded-none px-0 focus-visible:ring-0 focus-visible:border-black transition-colors h-12 bg-transparent placeholder:text-gray-300"
                    />
                  </div>
                </div>

                <div className="space-y-6 pt-4">
                   <Button 
                      type="submit" 
                      disabled={loading}
                      className="w-full h-14 rounded-full bg-black hover:bg-gray-900 text-white text-xs font-bold uppercase tracking-widest transition-all"
                   >
                     {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Continue with Email'}
                   </Button>
                   
                   <div className="text-center">
                      <Link href="/signup" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
                        New Member? Create Account
                      </Link>
                   </div>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-8">
                 <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="otp" className="text-xs font-bold uppercase tracking-widest text-gray-900">Security Code</Label>
                      <Input
                        id="otp"
                        type="text"
                        placeholder="• • • • • •"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        disabled={loading}
                        maxLength={6}
                        className="text-center text-2xl tracking-[1em] border-0 border-b border-gray-200 rounded-none px-0 focus-visible:ring-0 focus-visible:border-black transition-colors h-16 bg-transparent"
                      />
                    </div>
                 </div>

                 <div className="space-y-6 pt-4">
                   <Button 
                      type="submit" 
                      disabled={loading}
                      className="w-full h-14 rounded-full bg-black hover:bg-gray-900 text-white text-xs font-bold uppercase tracking-widest transition-all"
                   >
                     {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Verify & Login'}
                   </Button>
                    
                   <div className="flex justify-between items-center px-2">
                      <button type="button" onClick={handleBackToEmail} className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
                         Back
                      </button>
                      <button type="button" onClick={handleSendOtp} className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
                         Resend Code
                      </button>
                   </div>
                 </div>
              </form>
            )}
         </div>
      </div>
    </div>
  );
}

export default LoginPage;
