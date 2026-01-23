"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { storeAPI } from "@/lib/apiClients";

interface Collection {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await storeAPI.getPublicCollections({ limit: 50 });
        if (response.success && response.data?.collections) {
          const rawData = response.data.collections as any[];
          const uniqueMap = new Map<string, Collection>();

          rawData.forEach((item) => {
            // Handle potentially nested structure or flat structure
            const core = item.collections ? item.collections : item;
            const media = item.media ? item.media : null;
            
            if (core && core.id && !uniqueMap.has(core.id)) {
              uniqueMap.set(core.id, {
                id: core.id,
                title: core.title || "Untitled Collection",
                description: core.description || "",
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
        staggerChildren: 0.08,
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
      <div className="min-h-screen flex items-center justify-center pt-20 bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-black" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-b-2 border-black pb-8"
          >
            <h1 className="text-5xl md:text-7xl font-black font-serif uppercase tracking-tighter mb-3">
              Collections
            </h1>
            <p className="text-gray-500 uppercase tracking-widest font-bold text-xs">
              Explore our curated selection
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 pb-20">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {collections.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className="group"
            >
              <Link href={`/products?collection=${item.id}`}>
                <div className="border-2 border-gray-200 hover:border-black transition-all duration-300 bg-white overflow-hidden">
                  {/* Image Section */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                        <span className="text-gray-400 font-bold uppercase tracking-widest text-sm">
                          No Image
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="p-6 space-y-3">
                    <h2 className="text-2xl font-black font-serif uppercase tracking-tight group-hover:text-gray-600 transition-colors">
                      {item.title}
                    </h2>
                    
                    {item.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}

                    <div className="pt-2">
                      <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest group-hover:gap-3 transition-all">
                        <span>View Collection</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {collections.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-medium uppercase tracking-widest text-sm">
              No collections found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}