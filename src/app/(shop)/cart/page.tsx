"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Trash2, Minus, Plus, ArrowRight, Loader2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";
import { isAuthenticated } from "@/lib/apiClients/store/authentication";
import {
  getCart,
  removeFromCart as removeFromCartAPI,
  clearCart as clearCartAPI,
  updateCartItemQuantity as updateCartItemQuantityAPI,
  type CartItem as APICartItem,
} from "@/lib/apiClients";
import { motion, AnimatePresence } from "framer-motion";

interface DisplayCartItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

export default function CartPage() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [apiCartItems, setApiCartItems] = useState<DisplayCartItem[]>([]);
  const [apiLoading, setApiLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  
  // Local cart hook for guest users
  const {
    items: localCartItems,
    initialized: localInitialized,
    removeFromCart: removeFromLocalCart,
    updateItemQuantity: updateLocalItemQuantity,
    clearAllItems: clearLocalCart,
  } = useCart();

  // Check auth status and fetch API cart if authenticated
  useEffect(() => {
    const checkAuthAndFetchCart = async () => {
      const authenticated = isAuthenticated();
      setIsAuth(authenticated);
      
      if (authenticated) {
        setApiLoading(true);
        try {
          const result = await getCart();
          if (result.success && result.data?.cartItems) {
            const items: DisplayCartItem[] = result.data.cartItems.map((item: APICartItem) => ({
              id: item.id,
              productId: item.productId || "",
              title: item.product?.title || "Product",
              price: Number(item.product?.price || 0),
              quantity: item.quantity,
              image: item.product?.images?.[0]?.url,
            }));
            setApiCartItems(items);
          }
        } catch (error) {
          console.error("Failed to fetch cart:", error);
        } finally {
          setApiLoading(false);
        }
      } else {
        setApiLoading(false);
      }
    };
    
    checkAuthAndFetchCart();
  }, []);

  // Use API cart if authenticated, otherwise use local cart
  const cartItems = isAuth ? apiCartItems : localCartItems;
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const shipping = subtotal > 0 ? 10.0 : 0;
  const total = subtotal + shipping;
  const loading = isAuth ? apiLoading : !localInitialized;

  const handleUpdateQuantity = async (item: DisplayCartItem, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(item);
      return;
    }
    
    setUpdating(item.id);
    
    if (isAuth) {
      try {
        const result = await updateCartItemQuantityAPI(item.id, newQuantity);
        if (result.success) {
          setApiCartItems(items => 
            items.map(i => i.id === item.id ? { ...i, quantity: newQuantity } : i)
          );
          window.dispatchEvent(new Event('cart-update'));
        }
      } catch (error) {
        console.error("Failed to update quantity:", error);
      }
    } else {
      updateLocalItemQuantity(item.productId, newQuantity);
    }
    
    setUpdating(null);
  };

  const handleRemoveItem = async (item: DisplayCartItem) => {
    setUpdating(item.id);
    
    if (isAuth) {
      try {
        const result = await removeFromCartAPI(item.id);
        if (result.success) {
          setApiCartItems(items => items.filter(i => i.id !== item.id));
          window.dispatchEvent(new Event('cart-update'));
        }
      } catch (error) {
        console.error("Failed to remove item:", error);
      }
    } else {
      removeFromLocalCart(item.productId);
    }
    
    setUpdating(null);
  };

  const handleClearCart = async () => {
    if (!confirm("Are you sure you want to clear your cart?")) return;
    
    if (isAuth) {
      try {
        const result = await clearCartAPI();
        if (result.success) {
          setApiCartItems([]);
          window.dispatchEvent(new Event('cart-update'));
        }
      } catch (error) {
        console.error("Failed to clear cart:", error);
      }
    } else {
      clearLocalCart();
    }
  };

  const handleCheckout = () => {
    if (!isAuth) {
      router.push('/login?redirect=/checkout');
      return;
    }
    router.push('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-black" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="container px-4 md:px-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-16 border-b border-black pb-6 flex items-end justify-between"
        >
          <h1 className="text-5xl md:text-7xl font-black font-serif uppercase tracking-tighter leading-[0.8]">Cart</h1>
          {cartItems.length > 0 && (
             <span className="text-xs font-bold uppercase tracking-widest text-black mb-2 block">{count} Items</span>
          )}
        </motion.div>

        {cartItems.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="py-20 text-center"
          >
            <p className="text-xl md:text-2xl font-serif text-gray-300 italic mb-8">Your shopping bag is empty.</p>
            <Button asChild className="rounded-none px-10 py-6 bg-black text-white hover:bg-[#1A3C34] uppercase tracking-[0.2em] text-xs font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
              <Link href="/products">Explore Collection</Link>
            </Button>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-32">
            {/* Cart Items List */}
            <div className="lg:w-2/3">
               <div className="hidden md:flex justify-between border-b border-gray-200 pb-2 mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  <span className="flex-1">Details</span>
                  <span className="w-32 text-center">Quantity</span>
                  <span className="w-32 text-right">Total</span>
               </div>
               
               <motion.div 
                 initial="hidden"
                 animate="visible"
                 variants={{
                   visible: { transition: { staggerChildren: 0.1 } }
                 }}
                 className="divide-y divide-gray-100"
               >
                  <AnimatePresence mode="popLayout">
                    {cartItems.map((item) => (
                      <motion.div 
                        key={item.id}
                        layout
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: { opacity: 1, y: 0 }
                        }}
                        exit={{ opacity: 0, x: -20 }}
                        className="py-8 flex flex-col md:flex-row gap-8 md:items-start group"
                      >
                        {/* Product Info */}
                        <div className="flex-1 flex gap-8">
                          <Link href={`/products/${item.productId}`} className="relative h-32 w-24 bg-gray-100 shrink-0 overflow-hidden block">
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                sizes="96px"
                                className="object-cover transition-all duration-500"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center bg-gray-100">
                                <ShoppingCart className="h-6 w-6 text-gray-300" />
                              </div>
                            )}
                          </Link>
                          <div className="flex flex-col justify-between py-1">
                             <div className="space-y-1">
                                <Link href={`/products/${item.productId}`} className="text-xl font-bold font-serif uppercase tracking-tight hover:text-gray-500 transition-colors line-clamp-2">
                                  {item.title}
                                </Link>
                                <p className="text-xs text-gray-400 uppercase tracking-widest">Size: One Size</p>
                                <p className="text-sm font-medium pt-2">₹{Number(item.price).toFixed(2)}</p>
                             </div>
                             <button 
                                 onClick={() => handleRemoveItem(item)}
                                 disabled={updating === item.id}
                                 className="text-[10px] text-gray-400 font-bold uppercase tracking-widest hover:text-red-600 text-left w-fit flex items-center gap-2 transition-colors mt-4"
                             >
                               Remove
                             </button>
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-between md:justify-end md:gap-16 w-full md:w-auto pt-2">
                            {/* Quantity */}
                            <div className="flex items-center gap-4">
                                <button
                                  onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                                  disabled={updating === item.id || item.quantity <= 1}
                                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full disabled:opacity-30 transition-colors"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                 {updating === item.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                                  ) : (
                                    <span className="text-sm font-bold w-6 text-center font-serif text-lg">{item.quantity}</span>
                                  )}
                                <button
                                  onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                                  disabled={updating === item.id}
                                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                            </div>

                            {/* Total Price */}
                            <div className="text-right w-32">
                                <span className="text-lg font-medium font-serif block">
                                  ₹{Number(item.price * item.quantity).toFixed(2)}
                                </span>
                            </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
               </motion.div>
               
               {cartItems.length > 0 && (
                 <div className="mt-8 border-t border-gray-100 pt-8">
                   <Button variant="ghost" onClick={handleClearCart} className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-red-600 hover:bg-transparent px-0 h-auto">
                      Clear Bag
                   </Button>
                 </div>
               )}
            </div>

            {/* Checkout Summary */}
            <div className="lg:w-1/3">
               <div className="sticky top-32 space-y-8">
                  <h3 className="text-2xl font-black font-serif uppercase tracking-tight border-b border-black pb-4">Summary</h3>
                  
                  <div className="space-y-4 text-xs font-bold uppercase tracking-widest">
                     <div className="flex justify-between items-center text-gray-500">
                        <span>Subtotal</span>
                        <span>₹{Number(subtotal).toFixed(2)}</span>
                     </div>
                     <div className="flex justify-between items-center text-gray-500">
                        <span>Shipping</span>
                        <span>₹{Number(shipping).toFixed(2)}</span>
                     </div>
          
                  </div>
                  
                  <div className="flex justify-between items-end border-t border-gray-200 pt-6">
                     <span className="text-sm font-bold uppercase tracking-widest">Total</span>
                     <span className="text-3xl font-serif font-medium">₹{Number(total).toFixed(2)}</span>
                  </div>
                  
                  <Button onClick={handleCheckout} className="w-full h-16 rounded-none bg-black hover:bg-[#1A3C34] text-white font-bold uppercase tracking-[0.2em] text-xs flex items-center justify-between px-8 group transition-all transform hover:-translate-y-1 shadow-xl">
                     <span>Proceed to Checkout</span>
                     <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                  </Button>
                  
                  {!isAuth && (
                     <div className="text-center">
                       <Link href="/login" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black border-b border-gray-200 pb-0.5 hover:border-black transition-all">
                          Login to save your cart
                       </Link>
                     </div>
                  )}
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
