"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const HERO_IMAGES = [
  "/images/banner-1.jpeg",
  "/images/banner-2.jpeg",
  "/images/banner-3.jpeg",
  "/images/banner-4.jpeg",
];

export function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" as any }
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-black">
      <div className="grid w-full items-center justify-items-center">
        {/* Background Slider */}
        {HERO_IMAGES.map((image, index) => (
          <div
            key={image}
            className={`col-start-1 row-start-1 w-full transition-opacity duration-1000 ease-in-out relative ${
              index === currentIndex ? "opacity-100 z-0" : "opacity-0 -z-10"
            }`}
          >
             <Image
                src={image}
                alt="Hero Banner"
                width={0}
                height={0}
                sizes="100vw"
                className="w-full h-auto object-contain"
                style={{ width: '100%', height: 'auto' }}
                priority={index === 0}
             />
             <div className="absolute inset-0 bg-black/20" /> {/* Consistent overlay */}
          </div>
        ))}

        <motion.div 
          className="col-start-1 row-start-1 z-10 container flex flex-col items-center text-center text-white py-12 md:py-20 lg:py-32"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-normal tracking-wide leading-tight uppercase max-w-4xl mx-auto drop-shadow-md"
            variants={itemVariants}
          >
            In the right outfit <br />
            anything is possible
          </motion.h1>
          
          <motion.div 
            className="mt-12 flex flex-col sm:flex-row gap-6"
            variants={itemVariants}
          >
            <Link href="/products">
              <Button 
                  variant="secondary" 
                  size="lg" 
                  className="h-14 px-10 text-sm font-semibold tracking-widest uppercase bg-white text-black hover:bg-gray-100 rounded-full border-none hover:scale-105 transition-transform"
              >
                Collections
              </Button>
            </Link>
            <Link href="/products">
              <Button 
                  variant="default" 
                  size="lg" 
                  className="h-14 px-10 text-sm font-semibold tracking-widest uppercase bg-black text-white hover:bg-gray-800 rounded-full border-none hover:scale-105 transition-transform"
              >
                Shop Now
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
