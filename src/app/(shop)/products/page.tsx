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
import { isAuthenticated } from "@/lib/apiClients/store/authentication";
import { useAppDispatch } from "@/lib/store/hooks";
import { addItem, updateQuantity, removeItem } from "@/lib/store/cartSlice";
import { useCart } from "@/hooks/useCart";
import { motion, AnimatePresence } from "framer-motion";

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { isInCart, getItemQuantity, isAuth } = useCart();
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
  const [loadingCart, setLoadingCart] = useState<string | null>(null);
  const [loadingWishlist, setLoadingWishlist] = useState<string | null>(null);

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
        search: searchTerm || undefined,
      });
      if (response.success && response.data) {
        let filteredProducts = response.data || [];
        
        // Client-side collection filtering if API doesn't support it
        if (selectedCollection) {
          filteredProducts = filteredProducts.filter((product) =>
            product.collections?.some((col: any) => 
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
  }, [page, selectedCollection]);

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

  // Trigger fetch when searchTerm changes (e.g. from URL)
  // We combine this with the existing effect or add a new one.
  // Let's modify the existing main effect to include searchTerm.
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]); // Adding searchTerm to dependency

  const handleSearch = () => {
    setPage(1);
    // Push to URL instead of just fetching
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
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

  const handleAddToCart = async (e: React.MouseEvent, product: StoreProduct) => {
    e.preventDefault();
    e.stopPropagation();
    setLoadingCart(product.id);
    try {
      if (isAuth) {
        // Use API for authenticated users
        const result = await addToCartAPI({ productId: product.id, quantity: 1 });
        if (result.success) {
          window.dispatchEvent(new Event('cart-update'));
        } else {
          console.error("Failed to add to cart:", result.error);
        }
      } else {
        // Use local cart for guest users
        dispatch(addItem({
          id: `local_${product.id}_${Date.now()}`,
          productId: product.id,
          title: product.title,
          price: product.price,
          quantity: 1,
          image: product.images?.[0]?.url,
        }));
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setLoadingCart(null);
    }
  };

  const handleUpdateQuantity = async (e: React.MouseEvent, product: StoreProduct, newQuantity: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (newQuantity < 1) {
      dispatch(removeItem(product.id));
      return;
    }
    dispatch(updateQuantity({ productId: product.id, quantity: newQuantity }));
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
    <div className="container px-4 md:px-6 pt-32 pb-20 ">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 space-y-8 shrink-0">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-6 pb-2 border-b border-gray-100">Search & Filter</h2>
            <div className="space-y-8">
              <div className="space-y-2">
                <Label className="text-xs text-gray-400 uppercase tracking-wider">Search</Label>
                <div className="relative">
                   <Input
                     placeholder="Search..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                     className="pl-8 text-xs h-10 border-gray-200 focus:border-black rounded-sm bg-gray-50/50"
                   />
                   <div className="absolute left-2.5 top-3 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                   </div>
                </div>
              </div>
              
              <div>
                <Label className="text-xs text-gray-400 uppercase tracking-wider mb-4 block">Collections</Label>
                <div className="space-y-3">
                  {collections.length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                      No collections found
                    </p>
                  ) : (
                    collections.map((collection, index) => (
                      <div
                        key={`${collection.collections.id}-${index}`}
                        className="flex items-center space-x-3 group cursor-pointer"
                        onClick={() => handleCollectionChange(collection.collections.id)}
                      >
                         <div className={`w-3 h-3 border rounded-sm flex items-center justify-center transition-colors ${selectedCollection === collection.collections.id ? 'bg-black border-black' : 'border-gray-300 group-hover:border-black'}`}>
                            {selectedCollection === collection.collections.id && <Check className="h-2 w-2 text-white" />}
                         </div>
                        <span className={`text-sm transition-colors ${selectedCollection === collection.collections.id ? 'text-black font-medium' : 'text-gray-600 group-hover:text-black'}`}>
                          {collection.collections.title}
                        </span>
                      </div>
                    ))
                  )}
                </div>
                {selectedCollection && (
                    <Button
                    variant="link"
                    size="sm"
                    className="mt-2 text-[10px] uppercase tracking-widest text-gray-400 hover:text-red-500 h-auto p-0"
                    onClick={() => handleCollectionChange(selectedCollection)}
                  >
                    Clear Filter
                  </Button>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tight leading-none mb-2">
                {selectedCollection
                  ? collections.find((c) => c.collections.id === selectedCollection)
                      ?.collections.title || "Collection"
                  : "All Products"}
              </h1>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                 {products.length} {products.length === 1 ? 'Item' : 'Items'} Found
              </p>
            </div>
            
            {/* Pagination / Sort Controls (Simplified for now) */}
            <div className="flex items-center gap-2">
                 {page > 1 && (
                    <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} className="text-xs uppercase">Prev</Button>
                 )}
                 <span className="text-xs font-mono px-2">{page} / {totalPages}</span>
                 {page < totalPages && (
                    <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} className="text-xs uppercase">Next</Button>
                 )}
            </div>
          </div>

          {products.length === 0 ? (
             <div className="py-20 text-center border border-dashed border-gray-200 rounded-lg">
                <p className="text-gray-400 uppercase tracking-widest text-sm">No products found</p>
             </div>
          ) : (
            <motion.div 
               initial="hidden"
               animate="visible"
               variants={{
                 visible: { transition: { staggerChildren: 0.05 } }
               }}
               className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12"
            >
              <AnimatePresence>
{products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                  >
                    <ProductCard
                      product={product}
                      onAddToCart={handleAddToCart}
                      onAddToWishlist={handleAddToWishlist}
                      loading={loadingCart === product.id}
                      loadingWishlist={loadingWishlist === product.id}
                      priority={index < 4}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
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
