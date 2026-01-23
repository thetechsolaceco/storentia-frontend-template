'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

function SignupPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [storeConfigured, setStoreConfigured] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

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
        // Sync local cart to server after successful signup
        await syncLocalCartToServer();
        
        window.dispatchEvent(new Event('auth-change'));
        router.push('/');
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

  const handleBackToDetails = () => {
    setStep('details');
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
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left (Image) - different image for signup */}
      <div className="relative hidden lg:block bg-gray-100 order-last">
         <Image
            src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=2673&auto=format&fit=crop"
            alt="Editorial Signup"
            fill
            className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
            priority
         />
         <div className="absolute inset-0 bg-black/10" />
         <div className="absolute bottom-10 right-10 text-white text-right">
            <h2 className="text-4xl font-serif font-black uppercase tracking-tight mb-2">Join The Circle</h2>
            <p className="text-xs uppercase tracking-widest opacity-80 font-sans">Exclusive Access / Early Drops</p>
         </div>
      </div>

      {/* Right (Form) */}
      <div className="flex items-center justify-center bg-white p-8 lg:p-20">
         <div className="w-full max-w-md space-y-12">
            
            {/* Header */}
            <div className="space-y-4 text-center">
               <Link href="/" className="inline-block mb-12">
                 <span className="text-2xl font-black font-serif uppercase tracking-tighter hover:text-gray-600 transition-colors">STORENTIA</span>
               </Link>
               <div className="space-y-3">
                 <h1 className="text-3xl md:text-5xl font-serif font-black uppercase tracking-tight text-black">
                   {step === 'details' ? 'Create Account' : 'Verify Email'}
                 </h1>
                 <p className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] font-sans">
                    {step === 'details' ? 'Enter your details to get started' : 'Enter the code sent to your email'}
                 </p>
               </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-wide border-l-2 border-red-500">
                {error}
              </div>
            )}

            {step === 'details' ? (
              <form onSubmit={handleSendOtp} className="space-y-10">
                <div className="space-y-8">
                   <div className="grid grid-cols-2 gap-8">
                      <div className="relative group">
                        <Input 
                          id="firstName" 
                          placeholder="John" 
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required 
                          disabled={loading}
                          className="border-0 border-b border-gray-200 rounded-none px-0 py-6 text-lg focus-visible:ring-0 focus-visible:border-black transition-all bg-transparent placeholder:text-gray-300 font-sans"
                        />
                         <Label htmlFor="firstName" className="absolute -top-3 left-0 text-[10px] font-bold uppercase tracking-widest text-gray-400 group-focus-within:text-black transition-colors">First Name</Label>
                      </div>
                      <div className="relative group">
                        <Input 
                          id="lastName" 
                          placeholder="Doe" 
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required 
                          disabled={loading}
                          className="border-0 border-b border-gray-200 rounded-none px-0 py-6 text-lg focus-visible:ring-0 focus-visible:border-black transition-all bg-transparent placeholder:text-gray-300 font-sans"
                        />
                         <Label htmlFor="lastName" className="absolute -top-3 left-0 text-[10px] font-bold uppercase tracking-widest text-gray-400 group-focus-within:text-black transition-colors">Last Name</Label>
                      </div>
                   </div>
                  <div className="relative group">
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      className="border-0 border-b border-gray-200 rounded-none px-0 py-6 text-lg focus-visible:ring-0 focus-visible:border-black transition-all bg-transparent placeholder:text-gray-300 font-sans"
                    />
                     <Label htmlFor="email" className="absolute -top-3 left-0 text-[10px] font-bold uppercase tracking-widest text-gray-400 group-focus-within:text-black transition-colors">Email Address</Label>
                  </div>
                </div>

                <div className="space-y-6 pt-4">
                   <Button 
                      type="submit" 
                      disabled={loading}
                      className="w-full h-14 rounded-none bg-black hover:bg-[#1A3C34] text-white text-xs font-bold uppercase tracking-[0.2em] transition-all transform hover:-translate-y-1 duration-300 shadow-lg hover:shadow-xl"
                   >
                     {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Account'}
                   </Button>
                   
                   <div className="text-center">
                      <Link href="/login" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors border-b border-transparent hover:border-black pb-0.5">
                        Already a Member? Login
                      </Link>
                   </div>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-10">
                 <div className="space-y-6">
                    <div className="relative group">
                      <Input
                        id="otp"
                        type="text"
                        placeholder="• • • • • •"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        disabled={loading}
                        maxLength={6}
                        className="text-center text-3xl tracking-[0.5em] border-0 border-b border-gray-200 rounded-none px-0 py-6 focus-visible:ring-0 focus-visible:border-black transition-all h-20 bg-transparent font-serif"
                      />
                       <Label htmlFor="otp" className="absolute -top-3 left-0 text-[10px] font-bold uppercase tracking-widest text-gray-400 group-focus-within:text-black transition-colors w-full text-center">Security Code</Label>
                    </div>
                 </div>

                 <div className="space-y-6 pt-4">
                   <Button 
                      type="submit" 
                      disabled={loading}
                      className="w-full h-14 rounded-none bg-black hover:bg-[#1A3C34] text-white text-xs font-bold uppercase tracking-[0.2em] transition-all transform hover:-translate-y-1 duration-300 shadow-lg hover:shadow-xl"
                   >
                     {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Complete Signup'}
                   </Button>
                    
                   <div className="flex justify-between items-center px-1">
                      <button type="button" onClick={handleBackToDetails} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
                         Back
                      </button>
                      <button type="button" onClick={handleSendOtp} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
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

export default SignupPage;
