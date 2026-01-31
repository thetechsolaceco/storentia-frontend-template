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
              productId: item.productId,
              title: item.product?.title || "Product",
              price: item.product?.price || 0,
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
    <div className="container min-h-screen py-20 px-4 md:px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-center mb-4">Shopping Cart</h1>
        {cartItems.length > 0 && <span className="text-gray-400 font-medium uppercase tracking-widest text-xs">{count} Items</span>}
      </motion.div>

      {cartItems.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 max-w-md mx-auto"
        >
          <ShoppingCart className="h-16 w-16 mx-auto text-gray-200 mb-6" />
          <h2 className="text-xl font-bold uppercase tracking-wide mb-2">Your Bag is Empty</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Looks like you haven't added anything to your cart yet. Explore our latest collections.
          </p>
          <Button asChild className="rounded-full px-8 py-6 bg-black text-white hover:bg-gray-800 uppercase tracking-widest text-xs font-bold">
            <Link href="/products">Start Shopping</Link>
          </Button>
        </motion.div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          {/* Cart Items List */}
          <div className="lg:w-2/3">
             <div className="hidden md:flex justify-between border-b pb-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                <span className="flex-1">Product</span>
                <span className="w-32 text-center">Quantity</span>
                <span className="w-24 text-right">Total</span>
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
                      className="py-8 flex flex-col md:flex-row gap-6 md:items-center group"
                    >
                      {/* Product Info */}
                      <div className="flex-1 flex gap-6">
                        <Link href={`/products/${item.productId}`} className="relative h-24 w-20 bg-gray-50 shrink-0 overflow-hidden rounded-sm">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              sizes="80px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-gray-100">
                              <ShoppingCart className="h-6 w-6 text-gray-300" />
                            </div>
                          )}
                        </Link>
                        <div className="flex flex-col justify-between py-1">
                           <div>
                              <Link href={`/products/${item.productId}`} className="text-lg font-bold uppercase tracking-tight hover:text-gray-600 transition-colors line-clamp-2">
                                {item.title}
                              </Link>
                              <p className="text-sm text-gray-500 mt-1">${item.price.toFixed(2)}</p>
                           </div>
                           <button 
                              onClick={() => handleRemoveItem(item)}
                              disabled={updating === item.id}
                              className="text-xs text-red-500 font-bold uppercase tracking-widest hover:text-red-700 text-left w-fit flex items-center gap-1 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300"
                           >
                             <Trash2 className="h-3 w-3" /> Remove
                           </button>
                        </div>
                      </div>

                      {/* Controls (Mobile: Row, Desktop: Column/Grid) */}
                      <div className="flex items-center justify-between md:justify-end md:gap-12 w-full md:w-auto">
                          {/* Quantity */}
                          <div className="flex items-center border border-gray-200 rounded-full h-10 w-32 md:w-32 justify-between px-1">
                              <button
                                onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                                disabled={updating === item.id || item.quantity <= 1}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-30 transition-colors"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                               {updating === item.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                                ) : (
                                  <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                                )}
                              <button
                                onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                                disabled={updating === item.id}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                          </div>

                          {/* Total Price */}
                          <div className="text-right w-24">
                              <span className="text-lg font-bold block">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                          </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
             </motion.div>
             
             {cartItems.length > 0 && (
               <div className="mt-8">
                 <Button variant="outline" onClick={handleClearCart} className="text-xs uppercase tracking-widest text-gray-500 hover:text-black border-none px-0 hover:bg-transparent hover:underline decoration-1 underline-offset-4">
                    Clear Shopping Bag
                 </Button>
               </div>
             )}
          </div>

          {/* Checkout Summary */}
          <div className="lg:w-1/3">
             <div className="bg-gray-50 p-8 md:p-10 rounded-2xl sticky top-28">
                <h2 className="text-xl font-bold uppercase tracking-wide mb-8">Order Summary</h2>
                <div className="space-y-4 text-sm mb-8">
                   <div className="flex justify-between">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="font-bold">${subtotal.toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between">
                      <span className="text-gray-500">Shipping</span>
                      <span className="font-bold">${shipping.toFixed(2)}</span>
                   </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tax</span>
                      <span className="text-green-600 font-bold">Free</span>
                   </div>
                </div>
                <div className="flex justify-between items-center border-t border-gray-200 pt-6 mb-8">
                   <span className="text-base font-bold uppercase tracking-widest">Total</span>
                   <span className="text-2xl font-black">${total.toFixed(2)}</span>
                </div>
                <Button onClick={handleCheckout} className="w-full h-14 rounded-full bg-black hover:bg-gray-900 text-white font-bold uppercase tracking-widest text-xs flex items-center justify-between px-8 group">
                   <span>Checkout</span>
                   <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </Button>
                {!isAuth && (
                   <div className="mt-4 text-center">
                     <Link href="/login" className="text-xs text-gray-500 hover:text-black underline">
                        Login to save your cart
                     </Link>
                   </div>
                )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
