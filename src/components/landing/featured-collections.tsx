"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { storeAPI } from "@/lib/apiClients";

interface FeaturedCollection {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
}

export function FeaturedCollections() {
  const [collections, setCollections] = useState<FeaturedCollection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await storeAPI.getPublicCollections({ limit: 10 });
        if (response.success && response.data?.collections) {
          const rawData = response.data.collections as any[];
          const uniqueMap = new Map<string, FeaturedCollection>();

          rawData.forEach((item) => {
            // Handle potentially nested structure or flat structure
            const core = item.collections ? item.collections : item;
            const media = item.media ? item.media : null;
            
            if (core && core.id && !uniqueMap.has(core.id)) {
              uniqueMap.set(core.id, {
                id: core.id,
                title: core.title || "Untitled Collection",
                description: core.description || "",
                // Prioritize media object (from join), then direct image property.
                // Ensure we don't accidentally use a UUID string (imageId) as a URL.
                imageUrl: media?.url || (typeof core.image === 'string' && core.image.startsWith('http') ? core.image : null)
              });
            }
          });

          setCollections(Array.from(uniqueMap.values()));
        }
      } catch (error) {
        console.error("Failed to fetch collections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  if (loading) {
    return (
      <section className="py-20 ">
        <div className="container flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black" />
        </div>
      </section>
    );
  }

  if (collections.length === 0) {
    return null;
  }

  return (
    <section className="">
      <div className="container">

        {/* Collections Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {collections.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className="group cursor-pointer"
            >
              <Link href={`/products?collection=${item.id}`} className="block relative">
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100 mb-4">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                      <span className="text-gray-400">No Image</span>
                    </div>
                  )}
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  
                  {/* Floating Button */}
                  <div className="absolute bottom-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <Button size="icon" className="rounded-full bg-white text-emerald-950 hover:bg-[#1A3C34] hover:text-white shadow-lg border border-emerald-100">
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-serif font-bold text-black group-hover:text-[#1A3C34] transition-colors uppercase tracking-tight">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-sm text-gray-500 line-clamp-2">
                       {item.description}
                    </p>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
