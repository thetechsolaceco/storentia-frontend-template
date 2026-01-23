"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative w-full min-h-[600px] md:min-h-screen flex items-center overflow-hidden">
       {/* Background Image - Absolute to cover full height */}
       <div className="absolute inset-0 w-full h-full z-0">
          <Image
             src="/images/hero-background.jpg"
             alt="Hero Background"
             fill
             priority
             className="object-cover"
             sizes="100vw"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40" />
       </div>
       
       {/* Content Overlay */}
       <div className="relative z-10 container px-4 sm:px-6 md:px-8 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center text-center md:items-start md:text-left space-y-6 md:space-y-8 max-w-4xl mx-auto md:mx-0 md:pl-16 mt-20 md:mt-0"
          >
             <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-sans font-black tracking-tighter text-white leading-[0.9] uppercase drop-shadow-lg">
                Elegance In <br className="hidden md:block" />
                <span className="md:block mt-2">Every Movement</span>
             </h1>
             
             <p className="text-lg sm:text-xl md:text-2xl text-white/90 font-sans font-light drop-shadow-md max-w-lg">
                Where high-performance meets timeless style. redefine your workout wardrobe.
             </p>
             
             <div className="flex flex-col sm:flex-row gap-4 pt-6 w-full sm:w-auto">
                <Link href="/products/tops" className="w-full sm:w-auto">
                   <Button className="w-full sm:w-auto h-12 md:h-14 px-8 md:px-10 rounded-full bg-white text-black hover:bg-white/90 text-sm font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl">
                      Shop Tops
                   </Button>
                </Link>
                <Link href="/products/bottoms" className="w-full sm:w-auto">
                   <Button variant="outline" className="w-full sm:w-auto h-12 md:h-14 px-8 md:px-10 rounded-full bg-white/10 backdrop-blur-sm border-white/50 text-white hover:bg-white hover:text-black hover:border-white text-sm font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg">
                      Shop Bottoms
                   </Button>
                </Link>
             </div>
          </motion.div>
       </div>
    </section>
  );
}
