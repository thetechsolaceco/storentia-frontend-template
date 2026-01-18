"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { storeAPI, type StoreProduct } from "@/lib/apiClients";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton"; // Keep Skeleton for loading state
import { ProductCard } from "@/components/shared/product-card";

interface ProductGridProps {
  type?: 'trending' | 'latest' | 'recommended';
  limit?: number;
}

// Framer Motion Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as any } },
};

export function ProductGrid({ type = 'latest', limit = 10 }: ProductGridProps) {
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let result;
        switch (type) {
          case "trending":
            result = await storeAPI.getTrendingProducts(limit);
            break;
          case "recommended":
            result = await storeAPI.getRecommendedProducts(limit);
            break;
          case "latest":
          default:
            result = await storeAPI.getPublicProducts({ limit });
            break;
        }

        if (result.success && result.data) {
           const data = Array.isArray(result.data) ? result.data : (result.data as any).products || [];
           setProducts(data);
        }
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [type, limit]);

  if (loading) {
    return (
      <section >
        <div >
           <div className="flex flex-col items-center mb-12 text-center">
              <Skeleton className="h-10 w-64 mb-4" />
              <Skeleton className="h-4 w-96" />
           </div>
           {/* SkeletonRow */}
          <div className="flex gap-4 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="min-w-[280px] space-y-4">
                <Skeleton className="aspect-3/4 w-full rounded-xl" />
                <div className="space-y-2">
                   <Skeleton className="h-4 w-3/4" />
                   <Skeleton className="h-4 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section>
      <div>

        {/* Carousel */}
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full relative group/carousel"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <CarouselContent className="-ml-4">
              {products.map((product) => (
                <CarouselItem key={product.id} className="pl-4 md:basis-1/2 lg:basis-1/4">
                  <motion.div variants={itemVariants} className="h-full">
                    <ProductCard product={product} />
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </motion.div>
        </Carousel>
      </div>
    </section>
  );
}
