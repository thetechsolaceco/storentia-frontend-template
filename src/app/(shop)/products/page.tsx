"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ProductCard } from "@/components/shared/product-card";
import { Loader2, ShoppingCart, Heart, Minus, Plus, Check } from "lucide-react";
import {
  storeAPI,
  addToCart as addToCartAPI,
  addToWishlist,
  type StoreProduct,
  type StoreCollection,
} from "@/lib/apiClients";
import { useAppDispatch } from "@/lib/store/hooks";
import { removeItem } from "@/lib/store/cartSlice";
import { useCart } from "@/hooks/useCart";
import { motion, AnimatePresence } from "framer-motion";
import { useDebounce } from "@/hooks/useDebounce";

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { isInCart, getItemQuantity, isAuth, updateItemQuantity, addToCart } = useCart();
  const initialSearch = searchParams.get("search") || "";
  const initialCollection = searchParams.get("collection") || null;

  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [collections, setCollections] = useState<StoreCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    initialCollection
  );
  const [loadingWishlist, setLoadingWishlist] = useState<string | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Helper to get cart item info - uses auth-aware hook

  const fetchCollections = async () => {
    try {
      const response = await storeAPI.getPublicCollections({ limit: 50 });
      if (response.success && response.data?.collections) {
        // Deduplicate collections based on the inner collection ID
        const uniqueCollectionsMap = new Map();
        response.data.collections.forEach(item => {
           if (item.collections && item.collections.id) {
               if(!uniqueCollectionsMap.has(item.collections.id)) {
                   uniqueCollectionsMap.set(item.collections.id, item);
               }
           }
        });
        setCollections(Array.from(uniqueCollectionsMap.values()));
      }
    } catch (err) {
      console.error("Failed to load collections:", err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await storeAPI.getPublicProducts({
        page,
        limit: 50, // Fetch more to allow client-side filtering
        search: debouncedSearchTerm || undefined,
      });
      if (response.success && response.data) {
        let filteredProducts = response.data || [];
        
        // Client-side collection filtering if API doesn't support it
        if (selectedCollection) {
          filteredProducts = filteredProducts.filter((product) =>
            product.collections?.some((col: StoreProduct["collections"][number]) => 
              col.collectionId === selectedCollection || 
              col.collection?.id === selectedCollection
            )
          );
        }
        
        setProducts(filteredProducts);
        setTotalPages(Math.ceil(filteredProducts.length / 12) || 1);
      } else {
        setError(response.message || "Failed to load products");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, selectedCollection, debouncedSearchTerm]);

  // Sync state with URL search params
  useEffect(() => {
    const query = searchParams.get("search") || "";
    const collectionParam = searchParams.get("collection") || null;
    
    if (query !== searchTerm) {
      setSearchTerm(query);
    }
    if (collectionParam !== selectedCollection) {
      setSelectedCollection(collectionParam);
      setPage(1);
    }
  }, [searchParams]);

  const handleSearch = () => {
    setPage(1);
    // Push to URL instead of just fetching
    const term = searchTerm.trim();
    if (term) {
      router.push(`/products?search=${encodeURIComponent(term)}`);
    } else {
      router.push("/products");
    }
  };

  const handleCollectionChange = (collectionId: string) => {
    const newCollection = selectedCollection === collectionId ? null : collectionId;
    const params = new URLSearchParams(searchParams.toString());
    
    if (newCollection) {
      params.set("collection", newCollection);
    } else {
      params.delete("collection");
    }
    
    // Reset page logic handled in useEffect or manually here if needed, 
    // but useEffect above resets page when collectionParam changes.
    // However, existing simple state logic was just changing state.
    // We should push to router.
    router.push(`/products?${params.toString()}`);
  };

  const handleAddToCart = (e: React.MouseEvent, product: StoreProduct) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };



  const handleAddToWishlist = async (
    e: React.MouseEvent,
    productId: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setLoadingWishlist(productId);
    try {
      const result = await addToWishlist(productId);
      if (!result.success) {
        console.error("Failed to add to wishlist:", result.error);
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    } finally {
      setLoadingWishlist(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-black" />
      </div>
    );
  }

  if (error) {
     return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
           <p className="text-red-500 mb-4">{error}</p>
           <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
     );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Typography Banner */}
      <div className="relative pt-40 pb-20 px-4 md:px-8 border-b border-gray-100/50">
         <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center space-y-4"
         >
             <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-gray-400">
               {selectedCollection 
                  ? collections.find((c) => c.collections.id === selectedCollection)?.collections.title || "Curated"
                  : "All Arrivals"}
             </p>
             <h1 className="text-5xl md:text-8xl font-black font-serif uppercase tracking-tighter leading-[0.9] text-black">
                {selectedCollection ? "The Series" : "The Collection"}
             </h1>
             <p className="max-w-md mx-auto text-xs md:text-sm text-gray-500 font-sans leading-relaxed pt-4">
                Explore our meticulously crafted pieces, designed for the modern individual who seeks both style and substance.
             </p>
         </motion.div>
      </div>

      <div className="container px-4 md:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Sidebar Filters - Sticky & Minimal */}
          <aside className="w-full lg:w-64 space-y-12 shrink-0 lg:sticky lg:top-32 lg:h-fit">
            <div className="space-y-8">
               {/* Search */}
               <div className="space-y-4">
                 <Label className="text-[10px] font-bold uppercase tracking-widest text-black/40">Search Index</Label>
                 <div className="relative group">
                    <Input
                      placeholder="KEYWORD"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      className="pl-0 text-xs h-10 border-0 border-b border-gray-200 focus:border-black rounded-none bg-transparent placeholder:text-gray-300 transition-colors uppercase tracking-wider font-medium"
                    />
                    <div className="absolute right-0 top-3 text-gray-300 group-focus-within:text-black transition-colors">
                       <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    </div>
                 </div>
               </div>
               
               {/* Collections Filter */}
               <div>
                 <Label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-6 block">Categories</Label>
                 <div className="space-y-2">
                   <div 
                      className={`cursor-pointer group flex items-baseline justify-between py-1 transition-all ${!selectedCollection ? 'text-black' : 'text-gray-400 hover:text-black'}`}
                      onClick={() => handleCollectionChange("")}
                   >
                     <span className="text-xs font-bold uppercase tracking-widest transition-colors">All</span>
                     {!selectedCollection && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                   </div>
                   
                   {collections.map((collection, index) => (
                     <div
                       key={`${collection.collections.id}-${index}`}
                       className={`cursor-pointer group flex items-baseline justify-between py-1 transition-all ${selectedCollection === collection.collections.id ? 'text-black' : 'text-gray-400 hover:text-black'}`}
                       onClick={() => handleCollectionChange(collection.collections.id)}
                     >
                       <span className="text-xs font-bold uppercase tracking-widest transition-colors">{collection.collections.title}</span>
                       {selectedCollection === collection.collections.id && <span className="w-1.5 h-1.5 rounded-full bg-black mb-0.5" />}
                     </div>
                   ))}
                 </div>
               </div>
             </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
               <span className="text-[10px] font-bold uppercase tracking-widest text-black/60">
                  Showing {products.length} Results
               </span>
              
              {/* Pagination Controls */}
              <div className="flex items-center gap-4">
                   {page > 1 && (
                      <button onClick={() => setPage(page - 1)} className="text-[10px] font-bold uppercase tracking-widest hover:text-gray-600 transition-colors">Prev</button>
                   )}
                   <span className="text-[10px] font-mono px-2 text-gray-400">{page} / {totalPages}</span>
                   {page < totalPages && (
                      <button onClick={() => setPage(page + 1)} className="text-[10px] font-bold uppercase tracking-widest hover:text-gray-600 transition-colors">Next</button>
                   )}
              </div>
            </div>

            {products.length === 0 ? (
               <div className="py-32 text-center">
                  <p className="text-gray-300 font-serif text-2xl italic">No artifacts found.</p>
                  <Button variant="link" onClick={() => {setSearchTerm(""); setSelectedCollection(null);}} className="text-xs uppercase tracking-widest mt-4">Reset Filters</Button>
               </div>
            ) : (
              <motion.div 
                 key={`${page}-${selectedCollection}-${searchTerm}`}
                 initial="hidden"
                 animate="visible"
                 variants={{
                   visible: { transition: { staggerChildren: 0.1 } }
                 }}
                 className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16"
              >
                <AnimatePresence mode="wait">
                  {products.map((product, index) => (
                    <motion.div
                      key={product.id}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
                      }}
                    >
                      <ProductCard
                        product={product}
                        onAddToCart={handleAddToCart}
                        onUpdateQuantity={(e, product, qty) => {
                           e.preventDefault();
                           e.stopPropagation();
                           updateItemQuantity(product.id, qty);
                        }}
                        onAddToWishlist={handleAddToWishlist}
                        loading={false}
                        loadingWishlist={loadingWishlist === product.id}
                        priority={index < 4}
                        cartQuantity={getItemQuantity(product.id)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
             
            {/* Bottom Pagination */}
            {totalPages > 1 && (
               <div className="mt-20 flex justify-center border-t border-gray-100 pt-8">
                   <div className="flex gap-2">
                     {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                           key={i}
                           onClick={() => setPage(i + 1)}
                           className={`w-8 h-8 flex items-center justify-center text-[10px] font-bold border transition-all ${page === i + 1 ? 'border-black bg-black text-white' : 'border-transparent text-gray-400 hover:border-gray-200 hover:text-black'}`}
                        >
                           {i + 1}
                        </button>
                     ))}
                   </div>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="container py-10 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
