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

interface ProductGridProps {
  title: string;
  subtitle?: string;
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

export function ProductGrid({ title, subtitle, type = 'latest', limit = 10 }: ProductGridProps) {
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
      <section className="py-20 bg-white">
        <div className="container">
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
              {title}
            </motion.h2>
            {subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-xs md:text-sm text-gray-500 font-medium tracking-wide uppercase"
              >
                {subtitle}
              </motion.p>
            )}
        </div>

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
                  <motion.div variants={itemVariants} className="group relative cursor-pointer">
                    <Link href={`/products/${product.id}`} className="block h-full">
                      <div className="aspect-[3/4] w-full overflow-hidden rounded-2xl bg-gray-100 relative mb-4">
                        {product.images?.[0]?.url ? (
                          <Image
                            src={product.images[0].url}
                            alt={product.title}
                            fill
                            className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                        )}
                        {/* Overlay & Quick Actions */}
                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-4 left-4 right-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                            <Button className="w-full rounded-full bg-white text-black hover:bg-black hover:text-white font-bold uppercase tracking-wider text-xs shadow-lg">
                                Add to Cart
                            </Button>
                        </div>
                      </div>
                      <div className="text-center space-y-1">
                        <h3 className="text-sm font-bold uppercase tracking-wide text-black line-clamp-1 group-hover:text-gray-600 transition-colors">{product.title}</h3>
                        <p className="text-sm font-medium text-gray-900">${Number(product.price).toFixed(2)}</p>
                      </div>
                    </Link>
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
