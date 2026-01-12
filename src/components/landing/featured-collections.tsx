"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function FeaturedCollections() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="container">
        {/* Header */}
        <div className="flex flex-col items-center mb-12 text-center space-y-2">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-extrabold tracking-tight uppercase text-black"
          >
            Featured Collections
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xs md:text-sm text-gray-500 font-medium tracking-wide uppercase"
          >
            Top new collections with harfa brands explor now
          </motion.p>
        </div>

        {/* Bento Grid Layout */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-auto lg:h-[800px] mb-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          
          {/* Column 1: Jeans (Top) & T-Shirts (Bottom) */}
          <div className="flex flex-col gap-4 h-full">
            {/* Jeans - Small Landscape */}
            <motion.div variants={itemVariants} className="relative h-[30%] w-full bg-[#f5f5f5] rounded-3xl overflow-hidden group">
               <Image
                 src="https://images.unsplash.com/photo-1542272617-08f08632001d?q=80&w=1000&auto=format&fit=crop"
                 alt="Jeans"
                 fill
                 className="object-cover transition-transform duration-700 group-hover:scale-110"
               />
               <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
               <div className="absolute inset-0 flex items-center justify-center">
                 <span className="text-white text-2xl font-bold tracking-widest uppercase drop-shadow-md">Jeans</span>
               </div>
               <Link href="/products?category=jeans" className="absolute inset-0" />
            </motion.div>

            {/* T-Shirts - Tall Portrait */}
            <motion.div variants={itemVariants} className="relative h-[70%] w-full bg-[#f5f5f5] rounded-3xl overflow-hidden group">
               <Image
                 src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop"
                 alt="T-Shirts"
                 fill
                 className="object-cover transition-transform duration-700 group-hover:scale-110"
               />
               <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
               <div className="absolute inset-0 flex items-center justify-center">
                 <span className="text-white text-2xl font-bold tracking-widest uppercase drop-shadow-md">T-Shirts</span>
               </div>
               <Link href="/products?category=tshirts" className="absolute inset-0" />
            </motion.div>
          </div>

          {/* Column 2 & 3 (Middle Block): Hoodie (Top Tall) & Sneakers (Bottom Wide) */}
          <div className="col-span-1 md:col-span-2 flex flex-col gap-4 h-full"> 
             {/* Hoodie - Large Central */}
             <motion.div variants={itemVariants} className="relative h-[65%] w-full bg-[#EAEAEA] rounded-3xl overflow-hidden flex flex-col items-center justify-center text-center p-6 group">
                <div className="absolute inset-0 z-0">
                   <Image
                     src="https://images.unsplash.com/photo-1556906781-9a412961d289?q=80&w=1000&auto=format&fit=crop"
                     alt="Hoodie"
                     fill
                     className="object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
                   />
                </div>
                <div className="relative z-10 flex flex-col items-center gap-4">
                  <h3 className="text-4xl font-bold uppercase tracking-widest text-black">Hoodie</h3>
                  <p className="text-xs font-semibold tracking-wider text-black max-w-[200px]">
                    OPEN WITH BUY AND APPLY CODE GET OFFERS
                  </p>
                  <Button className="rounded-full bg-black text-white px-8 py-6 text-xs tracking-widest uppercase hover:bg-gray-800 hover:scale-105 transition-all">
                    Discover
                  </Button>
                </div>
                <Link href="/products?category=hoodie" className="absolute inset-0" />
             </motion.div>

             {/* Sneakers - Small Wide */}
             <motion.div variants={itemVariants} className="relative h-[35%] w-full bg-[#f5f5f5] rounded-3xl overflow-hidden group">
                <Image
                  src="https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=1000&auto=format&fit=crop"
                  alt="Sneakers"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                 <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                 <div className="absolute inset-0 flex items-center justify-center">
                 <span className="text-white text-2xl font-bold tracking-widest uppercase drop-shadow-md">Sneakers</span>
               </div>
               <Link href="/products?category=sneakers" className="absolute inset-0" />
             </motion.div>
          </div>

          {/* Column 4: Bags (Top) & Jacket (Bottom) */}
          <div className="flex flex-col gap-4 h-full">
             {/* Bags - Small Landscape */}
            <motion.div variants={itemVariants} className="relative h-[30%] w-full bg-[#f5f5f5] rounded-3xl overflow-hidden group">
               <Image
                 src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop"
                 alt="Bags"
                 fill
                 className="object-cover transition-transform duration-700 group-hover:scale-110"
               />
               <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
               <div className="absolute inset-0 flex items-center justify-center">
                 <span className="text-white text-2xl font-bold tracking-widest uppercase drop-shadow-md">Bags</span>
               </div>
               <Link href="/products?category=bags" className="absolute inset-0" />
            </motion.div>

            {/* Jacket - Tall Portrait */}
            <motion.div variants={itemVariants} className="relative h-[70%] w-full bg-[#f5f5f5] rounded-3xl overflow-hidden group">
               <Image
                 src="https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop"
                 alt="Jacket"
                 fill
                 className="object-cover transition-transform duration-700 group-hover:scale-110"
               />
               <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
               <div className="absolute inset-0 flex items-center justify-center">
                 <span className="text-white text-2xl font-bold tracking-widest uppercase drop-shadow-md">Jacket</span>
               </div>
               <Link href="/products?category=jacket" className="absolute inset-0" />
            </motion.div>
          </div>

        </motion.div>

        {/* Bottom Three Cards Layout */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[500px]"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
        >
           {/* Men */}
           <div className="relative h-full w-full rounded-3xl overflow-hidden group">
              <Image
                 src="https://images.unsplash.com/photo-1506634572416-48cdfe530110?q=80&w=1000&auto=format&fit=crop" 
                 alt="Men"
                 fill
                 className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
              <div className="absolute bottom-6 left-6 flex flex-col gap-4 transform translate-y-0 transition-transform duration-500">
                 <h3 className="text-4xl font-extrabold text-white uppercase tracking-wider">Men</h3>
                 <Button variant="secondary" className="w-fit rounded-full px-8 bg-white text-black hover:bg-gray-200 text-xs font-bold uppercase tracking-wider opacity-100 transition-opacity">
                   Shop Now
                 </Button>
              </div>
              <Link href="/products?gender=men" className="absolute inset-0" />
           </div>

           {/* Women */}
           <div className="relative h-full w-full rounded-3xl overflow-hidden group">
              <Image
                 src="https://images.unsplash.com/photo-1621786040688-66a9d15024b2?q=80&w=1000&auto=format&fit=crop" 
                 alt="Women"
                 fill
                 className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
              <div className="absolute bottom-6 left-6 flex flex-col gap-4 transform translate-y-0 transition-transform duration-500">
                 <h3 className="text-4xl font-extrabold text-white uppercase tracking-wider">Women</h3>
                 <Button variant="secondary" className="w-fit rounded-full px-8 bg-white text-black hover:bg-gray-200 text-xs font-bold uppercase tracking-wider opacity-100 transition-opacity">
                   Shop Now
                 </Button>
              </div>
              <Link href="/products?gender=women" className="absolute inset-0" />
           </div>

           {/* Kids */}
           <div className="relative h-full w-full rounded-3xl overflow-hidden group">
              <Image
                 src="https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?q=80&w=1000&auto=format&fit=crop" 
                 alt="Kids"
                 fill
                 className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
              <div className="absolute bottom-6 left-6 flex flex-col gap-4 transform translate-y-0 transition-transform duration-500">
                 <h3 className="text-4xl font-extrabold text-white uppercase tracking-wider">Kids</h3>
                 <Button variant="secondary" className="w-fit rounded-full px-8 bg-white text-black hover:bg-gray-200 text-xs font-bold uppercase tracking-wider opacity-100 transition-opacity">
                   Shop Now
                 </Button>
              </div>
              <Link href="/products?gender=kids" className="absolute inset-0" />
           </div>
        </motion.div>

      </div>
    </section>
  );
}
