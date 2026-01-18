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
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Loader2 className="h-8 w-8 animate-spin text-black" />
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <div className="pt-32 pb-12 bg-gray-50 text-center px-4">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-black font-serif uppercase tracking-tight mb-4"
        >
          Collections
        </motion.h1>
         <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 uppercase tracking-widest font-medium text-sm font-sans"
          >
            Explore our curated selection
          </motion.p>
      </div>

      <div className="container px-4 md:px-6 py-20">
        <motion.div
           className="grid grid-cols-1 md:grid-cols-2 gap-12"
           variants={containerVariants}
           initial="hidden"
           animate="visible"
        >
           {collections.map((item, index) => (
             <motion.div
               key={item.id}
               variants={itemVariants}
               className={`group cursor-pointer ${index % 3 === 0 ? 'md:col-span-2' : ''}`}
             >
                <Link href={`/products?collection=${item.id}`} className="block relative">
                   <div className={`relative overflow-hidden bg-gray-100 rounded-3xl ${index % 3 === 0 ? 'aspect-[2.4/1]' : 'aspect-square'}`}>
                      {item.imageUrl ? (
                         <Image
                           src={item.imageUrl}
                           alt={item.title}
                           fill
                           className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                         />
                      ) : (
                         <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                             <span className="text-gray-400 font-bold uppercase tracking-widest">No Image</span>
                         </div>
                      )}
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />
                      
                      {/* Content Overlay */}
                      <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
                         <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <h2 className="text-3xl md:text-5xl font-black font-serif uppercase text-white tracking-tighter mb-4 drop-shadow-lg">
                               {item.title}
                            </h2>
                            <p className="text-white/90 text-sm md:text-base max-w-lg mb-6 line-clamp-2 drop-shadow-md">
                               {item.description}
                            </p>
                            
                            <Button className="bg-white text-black hover:bg-[#1A3C34] hover:text-white rounded-full font-bold uppercase tracking-widest px-8 shadow-xl transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0">
                               View Collection
                            </Button>
                         </div>
                      </div>
                   </div>
                </Link>
             </motion.div>
           ))}
        </motion.div>
        
        {collections.length === 0 && (
           <div className="text-center py-20">
              <p className="text-gray-400 font-medium font-sans uppercase tracking-widest">No collections found</p>
           </div>
        )}
      </div>
    </div>
  );
}
