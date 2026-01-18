"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Code } from "lucide-react";
import { useRef } from "react";

export function Hero() {
  const targetRef = useRef<HTMLDivElement>(null);
  
  return (
    <section ref={targetRef} className="relative min-h-[100vh] w-full bg-[#050505] text-white flex flex-col items-center justify-start overflow-hidden pt-32 pb-20">
      {/* Abstract Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent pointer-events-none opacity-40" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-white/5 blur-[120px] rounded-full opacity-50 pointer-events-none" />
      
      {/* Content Container */}
      <motion.div 
        className="container relative z-10 flex flex-col items-center text-center space-y-12"
      >
        {/* Headlines */}
        <div className="space-y-6 max-w-5xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif font-black tracking-tight leading-[1.1] md:leading-[1.05] text-white"
          >
            Build Your Dream <br className="hidden md:block" />
            Store with <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-500 italic">Storentia</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-sans font-light leading-relaxed"
          >
            The ultimate production-ready Next.js frontend template. 
            Crafted for developers who demand performance, aesthetics, and flexibility.
          </motion.p>
        </div>

        {/* Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link href="/products">
             <Button size="lg" className="h-14 px-8 rounded-full bg-[#1A3C34] text-white hover:bg-[#0f2420] text-sm font-sans font-bold uppercase tracking-widest transition-all ">
                Explore Products
                <ArrowRight className="ml-2 h-4 w-4" />
             </Button>
          </Link>
          <Link href="https://github.com/thetechsolaceco/storentia-frontend-template" target="_blank">
             <Button variant="outline" size="lg" className="h-14 px-8 rounded-full bg-transparent border-white/20 text-white hover:bg-white/10 text-sm font-sans font-bold uppercase tracking-widest transition-all backdrop-blur-sm">
                <Code className="mr-2 h-4 w-4" />
                View Source
             </Button>
          </Link>
        </motion.div>

        {/* MacBook Pro Styled Mockup Frame (Screen Only) */}
        <motion.div 
           initial={{ opacity: 0, scale: 0.9, y: 40 }}
           animate={{ opacity: 1, scale: 1, y: 0 }}
           transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
           className="relative mt-20 w-full max-w-7xl mx-auto z-20 perspective-1000 px-4"
        >
           {/* Screen Frame - No Chin */}
           <div className="relative mx-auto bg-[#0d0d0d] rounded-[1.5rem] md:rounded-[2rem] border-[1px] border-[#333] shadow-2xl overflow-hidden ring-1 ring-white/5">
              {/* Webcam / Notch Area */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 md:w-32 h-5 md:h-6 bg-black rounded-b-xl z-20 flex items-center justify-center border-b border-white/5">
                 <div className="w-1.5 h-1.5 rounded-full bg-[#1a1a1a] ring-1 ring-[#333] flex items-center justify-center">
                   <div className="w-0.5 h-0.5 rounded-full bg-[#0f0] opacity-50"></div>
                 </div>
              </div>

              {/* Screen Content */}
              <div className="relative bg-black aspect-[16/10] md:aspect-[16/9] w-full border-[4px] md:border-[6px] border-black rounded-[1.5rem] md:rounded-[2rem] overflow-hidden">
                 <Image
                    src="/dashboard.png"
                    alt="Storentia Dashboard Preview"
                    fill
                    className="object-contain"
                    priority
                 />
                 {/* Screen Glare/Reflection */}
                 <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none z-10 rounded-[1.5rem] md:rounded-[2rem]" />
              </div>
           </div>
           
           {/* Glow below - Adjusted position since chin is gone */}
           <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[60%] h-32 bg-[#1A3C34] opacity-30 blur-[100px] rounded-full pointer-events-none" />
        </motion.div>

      </motion.div>
    </section>
  );
}
