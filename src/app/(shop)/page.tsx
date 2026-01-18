"use client";

import { Hero } from "@/components/landing/hero";
import { FeaturedCollections } from "@/components/landing/featured-collections";
import { ProductGrid } from "@/components/landing/product-grid";
import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function Marquee() {
  return (
    <div className="w-full bg-[#1A3C34] text-white overflow-hidden py-3">
      <div className="whitespace-nowrap flex animate-marquee">
        {[...Array(10)].map((_, i) => (
           <span key={i} className="mx-8 text-sm font-serif italic font-bold uppercase tracking-[0.2em] flex items-center gap-4">
            New Future of Stores. <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
           </span>
        ))}
        {/* Duplicate for seamless loop */}
         {[...Array(10)].map((_, i) => (
           <span key={`dup-${i}`} className="mx-8 text-sm font-serif italic font-bold uppercase tracking-[0.2em] flex items-center gap-4">
            New Future of Stores. <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
           </span>
        ))}
      </div>
    </div>
  );
}

function Newsletter() {
  return (
    <section className="py-24 bg-[#0a1a16] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1A3C34]/40 via-transparent to-transparent pointer-events-none" />
        <div className="container relative z-10 text-center max-w-2xl mx-auto space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-serif italic font-black tracking-tight uppercase">Don't Miss the Drop</h2>
              <p className="text-gray-400 text-lg font-sans">Sign up for exclusive releases, early access, and special offers.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input 
                type="email" 
                placeholder="ENTER YOUR EMAIL" 
                className="h-14 bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-full px-6 text-center sm:text-left focus-visible:ring-emerald-500 font-sans"
              />
              <Button size="lg" className="h-14 px-8 rounded-full bg-[#1A3C34] text-white hover:bg-[#142e28] font-bold uppercase tracking-widest shrink-0 font-sans shadow-lg shadow-[#1A3C34]/20">
                Subscribe <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-600 uppercase tracking-wide font-sans">By subscribing you agree to our Privacy Policy</p>
        </div>
    </section>
  )
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Hero />
      
      <Marquee />
    <section className="bg-gray-50 ">
      <div></div>
    <section className="py-20 container ">
         <div className="container mb-8 text-center space-y-2">
            <h2 className="text-3xl md:text-5xl font-serif font-black uppercase tracking-tight text-[#0a1a16]">Curated Collections</h2>
            <p className="text-gray-500 uppercase tracking-widest font-medium text-sm font-sans">Essentials for the modern wardrobe</p>
         </div>
         <FeaturedCollections />
      </section>
      
   <section className="py-20 container ">
         <div className="container mb-8 text-center space-y-2">
            <h2 className="text-3xl md:text-5xl font-serif font-black uppercase tracking-tight text-[#0a1a16]">New Arrivals</h2>
            <p className="text-gray-500 uppercase tracking-widest font-medium text-sm font-sans">Fresh looks just landed</p>
         </div>
         <ProductGrid 
        limit={8} 
      />
      </section>

         <section className="py-20 container">
         <div className="container mb-8 text-center space-y-2">
            <h2 className="text-3xl md:text-5xl font-serif font-black uppercase tracking-tight text-[#0a1a16]">Trending Now</h2>
            <p className="text-gray-500 uppercase tracking-widest font-medium text-sm font-sans">What everyone is wearing</p>
         </div>
         <ProductGrid 
        type="recommended" 
        limit={8} 
      />
      </section>

    </section>
  

    </div>
  );
}
