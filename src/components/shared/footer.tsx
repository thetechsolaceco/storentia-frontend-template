"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppSelector } from "@/lib/store/hooks";
import { selectStoreInfo } from "@/lib/store/storeSlice";
import { getPublicContent, POLICY_KEYS, type ContentItem } from "@/lib/apiClients";

// Predefined policy keys to check specifically if needed, 
// though we will likely hardcode the specific links requested in the design
// but keep the fetch to strictly preserve "integration".
const FOOTER_POLICY_KEYS: string[] = [
  POLICY_KEYS.PRIVACY,
  POLICY_KEYS.TERMS,
];

export function Footer() {
  const storeInfo = useAppSelector(selectStoreInfo);
  // We'll use "MILAN" to match the design, but keep storeInfo available if needed for other logic
  
  const [policies, setPolicies] = useState<ContentItem[]>([]);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const result = await getPublicContent();
        if (result.success && result.data) {
           setPolicies(result.data.filter((item) => FOOTER_POLICY_KEYS.includes(item.file_key)));
        }
      } catch (error) {
        console.error("Failed to fetch policies", error);
      }
    };
    fetchContent();
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for newsletter subscription logic
    console.log("Subscribing email:", email);
    setEmail("");
    alert("Thank you for subscribing!");
  };

  return (
    <footer className="bg-white pt-16 md:pt-24 pb-0">
      <div className="container mb-16 md:mb-24">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          
          {/* Left Side: Brand & Newsletter */}
          <div className="lg:w-1/3 space-y-6">
            <h1 className="text-5xl font-bold uppercase tracking-tight text-black">
             Store Name
            </h1>
            <p className="text-sm text-gray-500 font-medium uppercase leading-relaxed max-w-sm">
              Get newsletter update for upcoming products and best offers and discount for all items
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-4 max-w-md">
               <Input 
                 type="email" 
                 placeholder="YOUR EMAIL" 
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 className="rounded-full h-12 px-6 border-gray-300 text-xs tracking-wider uppercase placeholder:text-gray-400 focus-visible:ring-black"
                 required
               />
               <Button 
                 type="submit" 
                 className="rounded-full h-12 px-8 bg-black text-white hover:bg-gray-800 text-xs font-bold tracking-widest uppercase"
               >
                 Submit
               </Button>
            </form>
          </div>

          {/* Right Side: Links Columns */}
          <div className="lg:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-8">
            
            {/* SHOP Column */}
            <div className="space-y-6">
              <h3 className="text-base font-bold uppercase tracking-wide text-black">Shop</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/products" className="text-xs text-gray-500 hover:text-black font-medium uppercase tracking-wide transition-colors">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="/products?sort=newest" className="text-xs text-gray-500 hover:text-black font-medium uppercase tracking-wide transition-colors">
                    New Arrivals
                  </Link>
                </li>
              </ul>
            </div>

            {/* HELP Column */}
            <div className="space-y-6">
              <h3 className="text-base font-bold uppercase tracking-wide text-black">Help</h3>
              <ul className="space-y-3">
                  <li>
                    <Link href="/contact" className="text-xs text-gray-500 hover:text-black font-medium uppercase tracking-wide transition-colors">
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/profile" className="text-xs text-gray-500 hover:text-black font-medium uppercase tracking-wide transition-colors">
                      My Account
                    </Link>
                  </li>
                   {/* Dynamic Policy Links if available, else static */}
                   {policies.length > 0 ? (
                      policies.map(p => (
                         <li key={p.id}>
                            <Link href={`/policy/${p.file_key}`} className="text-xs text-gray-500 hover:text-black font-medium uppercase tracking-wide transition-colors">
                              {p.file_data.title}
                            </Link>
                         </li>
                      ))
                   ) : (
                      <li>
                        <Link href="/policy/privacy-policy" className="text-xs text-gray-500 hover:text-black font-medium uppercase tracking-wide transition-colors">
                          Legal & Privacy
                        </Link>
                      </li>
                   )}
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="w-full bg-[#111111] py-6">
        <div className="container">
           <p className="text-xs text-white/80 font-medium tracking-wide uppercase">
             &copy; 2025 Milan Allrights Reserved.
           </p>
        </div>
      </div>
    </footer>
  );
}
