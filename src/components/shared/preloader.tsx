"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  // Reset loading state on route change? 
  // Usually preloaders are for the initial visit. 
  // Let's stick to initial load for now to avoid bad UX on navigation.
  
  useEffect(() => {
    // Simulate loading time or wait for actual resources
    // For a template, a fixed timer is common to show off the branding
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
        >
          <div className="relative overflow-hidden">
             <motion.div
               initial={{ y: 100, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
               className="text-center"
             >
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-widest uppercase font-serif">
                  Storentia
                </h1>
                <p className="text-white/60 text-xs md:text-sm tracking-[0.5em] mt-2 uppercase font-sans">
                  Premium Experience
                </p>
             </motion.div>
             
             {/* Simple loading bar */}
             <motion.div 
               initial={{ scaleX: 0 }}
               animate={{ scaleX: 1 }}
               transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
               className="absolute bottom-0 left-0 right-0 h-[2px] bg-white origin-left mt-8"
             />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
