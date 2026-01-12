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

  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [collections, setCollections] = useState<StoreCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    null
  );
  const [loadingCart, setLoadingCart] = useState<string | null>(null);
  const [loadingWishlist, setLoadingWishlist] = useState<string | null>(null);

  // Helper to get cart item info - uses auth-aware hook

  const fetchCollections = async () => {
    try {
      const response = await storeAPI.getPublicCollections({ limit: 50 });
      if (response.success && response.data?.collections) {
        setCollections(response.data.collections);
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
    if (query !== searchTerm) {
      setSearchTerm(query);
      // We need to fetch products when URL changes.
      // Ideally we should depend on searchTerm in fetchProducts or add it to dependency array of the main fetch effect.
      // But fetchProducts reads the *current* state of searchTerm.
      // If we just set state here, it might not be updated in the closure of an immediate fetch call unless we add it to deps.
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
    setSelectedCollection(
      selectedCollection === collectionId ? null : collectionId
    );
    setPage(1);
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
    <div className="container py-10 md:py-20 px-4 md:px-6">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 space-y-8 shrink-0">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-6 pb-2 border-b border-gray-100">Search & Filter</h3>
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
                        key={`${collection.id}-${index}`}
                        className="flex items-center space-x-3 group cursor-pointer"
                        onClick={() => handleCollectionChange(collection.id)}
                      >
                         <div className={`w-3 h-3 border rounded-sm flex items-center justify-center transition-colors ${selectedCollection === collection.id ? 'bg-black border-black' : 'border-gray-300 group-hover:border-black'}`}>
                            {selectedCollection === collection.id && <Check className="h-2 w-2 text-white" />}
                         </div>
                        <span className={`text-sm transition-colors ${selectedCollection === collection.id ? 'text-black font-medium' : 'text-gray-600 group-hover:text-black'}`}>
                          {collection.title}
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
                    onClick={() => setSelectedCollection(null)}
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
                  ? collections.find((c) => c.id === selectedCollection)
                      ?.title || "Collection"
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
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    className="group"
                  >
                    {/* Image Container */}
                    <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden mb-4 cursor-pointer" onClick={() => router.push(`/products/${product.id}`)}>
                       {product.images?.[0]?.url ? (
                          <div className="w-full h-full relative">
                            <Image
                                src={product.images[0].url}
                                alt={product.title}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                            />
                             {/* Overlay on hover */}
                             <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                          </div>
                       ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                             <div className="w-10 h-10 border-2 border-current rounded-full flex items-center justify-center">?</div>
                          </div>
                       )}

                       {/* Status Badge */}
                       {product.status !== 'ACTIVE' && (
                          <div className="absolute top-3 left-3 bg-white/90 text-[10px] font-bold uppercase tracking-widest px-2 py-1">
                             {product.status.toLowerCase()}
                          </div>
                       )}

                       {/* Quick Add Button - Slides up */}
                       <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-10">
                          <Button
                             onClick={(e) => handleAddToCart(e, product)}
                             disabled={loadingCart === product.id || product.status !== "ACTIVE"}
                             className="w-full bg-white text-black hover:bg-black hover:text-white border-none shadow-lg text-xs font-bold uppercase tracking-widest h-10"
                          >
                             {loadingCart === product.id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Add to Cart"}
                          </Button>
                       </div>
                       
                       {/* Wishlist Button - Top Right */}
                       <button
                          onClick={(e) => handleAddToWishlist(e, product.id)}
                          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white text-black translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
                       >
                          {loadingWishlist === product.id ? (
                             <Loader2 className="h-3 w-3 animate-spin block" />
                          ) : (
                             <Heart className="h-3 w-3 block hover:fill-red-500 hover:text-red-500 transition-colors" />
                          )}
                       </button>
                    </div>

                    {/* Content */}
                    <div className="text-center group-hover:translate-y-[-4px] transition-transform duration-300">
                       <Link href={`/products/${product.id}`} className="block">
                          <h3 className="text-sm font-bold uppercase tracking-tight mb-1 group-hover:text-gray-600 transition-colors line-clamp-1">
                             {product.title}
                          </h3>
                       </Link>
                       <p className="text-sm text-gray-500 font-medium">
                          ${Number(product.price).toFixed(2)}
                       </p>
                    </div>
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
