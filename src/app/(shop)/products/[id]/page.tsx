"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Heart, ShoppingCart, Star, Loader2, ArrowLeft, Minus, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { storeAPI, addToCart as addToCartAPI, addToWishlist, getWishlist, removeFromWishlist, type StoreProduct } from "@/lib/apiClients";
import { isAuthenticated } from "@/lib/apiClients/store/authentication";
import { useCart } from "@/hooks/useCart";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  
  // Use the cart hook for guest cart functionality
  const { addToCart, getItemQuantity, updateItemQuantity, isInCart, isAuth } = useCart();

  const [product, setProduct] = useState<StoreProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistItemId, setWishlistItemId] = useState<string | null>(null);
  const [togglingWishlist, setTogglingWishlist] = useState(false);

  const cartQuantity = getItemQuantity(productId);
  const productInCart = isInCart(productId);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await storeAPI.getPublicProductById(productId);
        if (response.success && response.data) {
          setProduct(response.data);
        } else {
          setError(response.message || "Product not found");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    const checkWishlist = async () => {
      if (!isAuthenticated()) return;
      try {
        const result = await getWishlist();
        if (result.success && result.data?.wishlistItems) {
          const item = result.data.wishlistItems.find(i => i.productId === productId);
          if (item) {
            setInWishlist(true);
            setWishlistItemId(item.id);
          }
        }
      } catch (err) {
        console.error('Failed to check wishlist:', err);
      }
    };

    if (productId) {
      fetchProduct();
      checkWishlist();
    }
  }, [productId]);

  const handleAddToCart = async () => {
    if (!product) return;

    setAddingToCart(true);
    setError(null);
    
    try {
      if (isAuth) {
        // Use API for authenticated users
        const result = await addToCartAPI({ productId: product.id, quantity });
        if (result.success) {
          window.dispatchEvent(new Event('cart-update'));
        } else {
          setError(result.error || 'Failed to add to cart');
        }
      } else {
        // Use local cart for guest users
        addToCart(product, quantity);
      }
    } catch (err) {
      setError('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleUpdateCartQuantity = (newQuantity: number) => {
    updateItemQuantity(productId, newQuantity);
  };

  const handleToggleWishlist = async () => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    if (!product?.id) return;

    setTogglingWishlist(true);
    try {
      if (inWishlist && wishlistItemId) {
        const result = await removeFromWishlist(wishlistItemId);
        if (result.success) {
          setInWishlist(false);
          setWishlistItemId(null);
          window.dispatchEvent(new Event('wishlist-update'));
        }
      } else {
        const result = await addToWishlist(product.id);
        if (result.success && result.data?.wishlistItems) {
          const item = result.data.wishlistItems.find(i => i.productId === product.id);
          if (item) {
            setInWishlist(true);
            setWishlistItemId(item.id);
          }
          window.dispatchEvent(new Event('wishlist-update'));
        }
      }
    } catch (err) {
      setError('Failed to update wishlist');
    } finally {
      setTogglingWishlist(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-black" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center">
        <p className="text-xl text-black mb-6 font-medium uppercase tracking-widest">{error || "Product not found"}</p>
        <Button variant="outline" className="rounded-full px-8 py-6 border-black text-black hover:bg-black hover:text-white uppercase tracking-widest text-xs font-bold" asChild>
          <Link href="/products">
             Back to Products
          </Link>
        </Button>
      </div>
    );
  }

  const mainImage = product.images?.[selectedImage]?.url || "/placeholder.svg";

  return (
    <div className="bg-white min-h-screen pt-20 pb-20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          
          {/* Left Column - Sticky Images */}
          <div className="lg:w-1/2">
            <div className="lg:sticky lg:top-28 space-y-6">
               {/* Nav Back (Mobile only) */}
               <div className="lg:hidden mb-4">
                  <Link href="/products" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors">
                    <ArrowLeft className="mr-2 h-3 w-3" /> Back
                  </Link>
               </div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative aspect-[3/4] w-full bg-gray-50 rounded-lg overflow-hidden"
              >
                <Image
                  src={mainImage}
                  alt={product.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                  className="object-cover"
                />
                {product.status === "ACTIVE" && (
                   <div className="absolute top-4 left-4 bg-black text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 backdrop-blur-md">
                      In Stock
                   </div>
                )}
              </motion.div>

              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {product.images.map((img, index) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImage(index)}
                      className={`relative w-24 h-32 flex-shrink-0 bg-gray-50 overflow-hidden transition-all duration-300 ${
                        selectedImage === index ? "ring-1 ring-black opacity-100" : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image src={img.url} alt="" fill sizes="96px" className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div className="lg:w-1/2 flex flex-col pt-4">
             {/* Nav Back (Desktop) */}
             <div className="hidden lg:block mb-8">
                <Link href="/products" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
                  <ArrowLeft className="mr-2 h-3 w-3" /> Back to Products
                </Link>
             </div>

             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6, delay: 0.2 }}
               className="space-y-8"
             >
                {/* Header */}
                <div className="space-y-4 border-b border-gray-100 pb-8">
                   <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-black leading-[0.9]">
                     {product.title}
                   </h1>
                   <div className="flex items-center justify-between">
                      <p className="text-2xl md:text-3xl font-medium text-black">
                        ${Number(product.price).toFixed(2)}
                      </p>
                      <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-black text-black" />
                          ))}
                          <span className="text-xs font-bold ml-2 text-gray-400 uppercase tracking-wider">No Reviews</span>
                      </div>
                   </div>
                </div>

                {/* Description - Short */}
                {product.description && (
                  <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
                    <p>{product.description}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="pt-4 space-y-6">
                   {/* Quantity */}
                   <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-widest text-black">Quantity</span>
                      <div className="flex items-center border border-gray-200 rounded-full p-1">
                        <button 
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          disabled={quantity <= 1}
                          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors disabled:opacity-30"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-12 text-center font-bold text-sm">{quantity}</span>
                         <button 
                          onClick={() => setQuantity(quantity + 1)}
                          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                   </div>

                   {/* Add to Cart / Wishlist */}
                   <div className="flex gap-4">
                      {productInCart ? (
                         <div className="flex-1 flex items-center justify-between bg-black text-white px-6 py-4 rounded-full">
                            <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                              <Check className="h-4 w-4" /> In Cart
                            </span>
                             <div className="flex items-center gap-3">
                                <button onClick={() => handleUpdateCartQuantity(cartQuantity - 1)} className="hover:text-gray-300">
                                   <Minus className="h-4 w-4" />
                                </button>
                                <span className="text-sm font-bold">{cartQuantity}</span>
                                <button onClick={() => handleUpdateCartQuantity(cartQuantity + 1)} className="hover:text-gray-300">
                                   <Plus className="h-4 w-4" />
                                </button>
                             </div>
                         </div>
                      ) : (
                        <Button 
                          onClick={handleAddToCart}
                          disabled={addingToCart || product.status !== "ACTIVE"}
                          className="flex-1 h-14 rounded-full bg-black hover:bg-gray-900 text-white text-xs font-bold uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                           {addingToCart ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ShoppingCart className="h-4 w-4 mr-2" />}
                           Add to Cart
                        </Button>
                      )}

                      <Button 
                        variant="outline"
                        onClick={handleToggleWishlist}
                        disabled={togglingWishlist}
                        className="h-14 w-14 rounded-full border-gray-200 hover:border-black hover:bg-transparent transition-colors p-0 flex items-center justify-center shrink-0"
                      >
                         {togglingWishlist ? (
                           <Loader2 className="h-5 w-5 animate-spin" />
                         ) : (
                           <Heart className={`h-5 w-5 transition-colors ${inWishlist ? "fill-red-500 text-red-500" : "text-black"}`} />
                         )}
                      </Button>
                   </div>
                </div>
                
                {/* Meta details */}
                <div className="border-t border-gray-100 pt-8 space-y-4">
                    <div className="flex justify-between text-xs uppercase tracking-widest">
                       <span className="text-gray-400">ID</span>
                       <span className="font-bold">{product.id}</span>
                    </div>
                     <div className="flex justify-between text-xs uppercase tracking-widest">
                       <span className="text-gray-400">Category</span>
                       <span className="font-bold">Originals</span>
                    </div>
                     <div className="flex justify-between text-xs uppercase tracking-widest">
                       <span className="text-gray-400">Authenticity</span>
                       <span className="font-bold text-green-600">Verified</span>
                    </div>
                </div>

             </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
