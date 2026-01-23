"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, MapPin, Plus, Minus, Trash2, ShoppingBag, Check } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createOrder,
  getAllAddresses,
  createAddress,
  getCart,
  updateCartItemQuantity as updateCartItemQuantityAPI,
  removeFromCart as removeFromCartAPI,
  type Address,
  type CreateAddressRequest,
  type CartItem as APICartItem,
} from "@/lib/apiClients";
import { isAuthenticated } from "@/lib/apiClients/store/authentication";

interface CheckoutCartItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  quantity: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CheckoutCartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartLoading, setCartLoading] = useState(true);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [newAddress, setNewAddress] = useState<CreateAddressRequest>({
    firstName: "",
    lastName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated()) {
      router.push('/login?redirect=/checkout');
      return;
    }
    
    fetchAddresses();
    fetchCart();
  }, [router]);

  const fetchCart = async () => {
    setCartLoading(true);
    try {
      const result = await getCart();
      if (result.success && result.data?.cartItems) {
        const items: CheckoutCartItem[] = result.data.cartItems.map((item: APICartItem) => ({
          id: item.id,
          productId: item.productId,
          title: item.product?.title || "Product",
          price: Number(item.product?.price || 0),
          quantity: item.quantity,
        }));
        setCartItems(items);
        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setCartTotal(total);
      } else {
        setCartItems([]);
        setCartTotal(0);
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      setCartItems([]);
      setCartTotal(0);
    } finally {
      setCartLoading(false);
    }
  };

  const fetchAddresses = async () => {
    setLoading(true);
    const response = await getAllAddresses();
    if (response.success && response.data) {
      setAddresses(response.data);
      const defaultAddr = response.data.find((a) => a.address.isDefault) || response.data[0];
      if (defaultAddr) setSelectedAddress(defaultAddr);
      if (response.data.length === 0) setShowAddForm(true);
    }
    setLoading(false);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveAddress = async () => {
    setSavingAddress(true);
    setError(null);
    const response = await createAddress(newAddress);
    if (response.success && response.data) {
      setAddresses((prev) => [...prev, response.data!]);
      setSelectedAddress(response.data);
      setShowAddForm(false);
      setNewAddress({
        firstName: "",
        lastName: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        phone: "",
      });
    } else {
      setError(response.error || "Failed to save address");
    }
    setSavingAddress(false);
  };

  const handleUpdateQuantity = async (item: CheckoutCartItem, newQuantity: number) => {
    if (newQuantity < 1) {
      // Remove item
      try {
        const result = await removeFromCartAPI(item.id);
        if (result.success) {
          setCartItems(items => items.filter(i => i.id !== item.id));
          setCartTotal(prev => prev - item.price * item.quantity);
          window.dispatchEvent(new Event('cart-update'));
        }
      } catch (error) {
        console.error("Failed to remove item:", error);
      }
    } else {
      // Update quantity
      try {
        const result = await updateCartItemQuantityAPI(item.id, newQuantity);
        if (result.success) {
          const diff = newQuantity - item.quantity;
          setCartItems(items => 
            items.map(i => i.id === item.id ? { ...i, quantity: newQuantity } : i)
          );
          setCartTotal(prev => prev + item.price * diff);
          window.dispatchEvent(new Event('cart-update'));
        }
      } catch (error) {
        console.error("Failed to update quantity:", error);
      }
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress || cartItems.length === 0) return;

    setIsPlacingOrder(true);
    setError(null);

    const response = await createOrder({
      items: cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      shippingAddress: {
        firstName: selectedAddress.address.firstName,
        lastName: selectedAddress.address.lastName,
        address: selectedAddress.address.addressLine1,
        city: selectedAddress.address.city,
        state: selectedAddress.address.state,
        zipCode: selectedAddress.address.postalCode,
      },
      contact: {
        email: "",
        phone: selectedAddress.address.phone,
      },
      payment: { method: "card" },
      total: cartTotal,
    });

    setIsPlacingOrder(false);

    if (response.success) {
      // Clear cart and refresh
      window.dispatchEvent(new Event('cart-update'));
      setCartItems([]);
      setCartTotal(0);
      setShowSuccess(true);
    } else {
      setError(response.message || "Failed to place order");
    }
  };

  if (loading || cartLoading) {
    return (
      <div className="container py-20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="container px-4 md:px-8 max-w-6xl">
        
        {/* Header */}
         <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-16 border-b border-black pb-6"
        >
          <h1 className="text-5xl md:text-7xl font-black font-serif uppercase tracking-tighter leading-[0.8]">Checkout</h1>
        </motion.div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 mb-10 text-xs font-bold uppercase tracking-widest border border-red-100">
            {error}
          </div>
        )}

        {/* Success Popup */}
        <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
          <DialogContent className="sm:max-w-md text-center p-12 border-0 shadow-2xl">
            <DialogTitle className="sr-only">Order Placed Successfully</DialogTitle>
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-black flex items-center justify-center mb-8 animate-[scale-in_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)]">
                <Check className="h-10 w-10 text-white animate-[check-draw_0.6s_ease-out_0.2s_both]" strokeWidth={3} />
              </div>
              <h2 className="text-3xl font-black font-serif uppercase tracking-tight mb-4">Order Confirmed</h2>
              <p className="text-gray-500 mb-10 leading-relaxed font-sans max-w-xs mx-auto">
                Thank you for your purchase. Your order has been securely placed and is being processed.
              </p>
              <div className="flex flex-col w-full gap-3">
                <Button asChild className="w-full h-14 rounded-none bg-black hover:bg-[#1A3C34] text-white text-xs font-bold uppercase tracking-[0.2em] shadow-lg">
                  <Link href="/profile">View Order Details</Link>
                </Button>
                <Button variant="outline" asChild className="w-full h-14 rounded-none border-gray-200 hover:border-black text-xs font-bold uppercase tracking-[0.2em] hover:bg-transparent">
                  <Link href="/products">Continue Shopping</Link>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          {/* Left Column: Shipping & Payment */}
          <div className="lg:col-span-7 space-y-16">
            
            {/* Address Section */}
             <section>
                <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
                  <h3 className="text-xl font-bold uppercase tracking-widest flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-black text-white text-[10px] flex items-center justify-center">1</span>
                    Shipping Address
                  </h3>
                  {addresses.length > 0 && !showAddForm && (
                    <button 
                      onClick={() => setShowAddForm(true)}
                      className="text-[10px] font-bold uppercase tracking-widest hover:text-gray-500 transition-colors flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" /> Add New
                    </button>
                  )}
                </div>
                
                {showAddForm ? (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-6 bg-gray-50 p-8 rounded-sm"
                  >
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-[10px] uppercase tracking-widest text-gray-500">First Name</Label>
                        <Input name="firstName" value={newAddress.firstName} onChange={handleAddressChange} className="bg-white border-gray-200 focus:border-black rounded-none h-12" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-[10px] uppercase tracking-widest text-gray-500">Last Name</Label>
                        <Input name="lastName" value={newAddress.lastName} onChange={handleAddressChange} className="bg-white border-gray-200 focus:border-black rounded-none h-12" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="addressLine1" className="text-[10px] uppercase tracking-widest text-gray-500">Address</Label>
                      <Input name="addressLine1" value={newAddress.addressLine1} onChange={handleAddressChange} className="bg-white border-gray-200 focus:border-black rounded-none h-12" />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-[10px] uppercase tracking-widest text-gray-500">City</Label>
                        <Input name="city" value={newAddress.city} onChange={handleAddressChange} className="bg-white border-gray-200 focus:border-black rounded-none h-12" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state" className="text-[10px] uppercase tracking-widest text-gray-500">State</Label>
                        <Input name="state" value={newAddress.state} onChange={handleAddressChange} className="bg-white border-gray-200 focus:border-black rounded-none h-12" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <Label htmlFor="postalCode" className="text-[10px] uppercase tracking-widest text-gray-500">Postal Code</Label>
                         <Input name="postalCode" value={newAddress.postalCode} onChange={handleAddressChange} className="bg-white border-gray-200 focus:border-black rounded-none h-12" />
                      </div>
                      <div className="space-y-2">
                         <Label htmlFor="country" className="text-[10px] uppercase tracking-widest text-gray-500">Country</Label>
                         <Input name="country" value={newAddress.country} onChange={handleAddressChange} className="bg-white border-gray-200 focus:border-black rounded-none h-12" />
                      </div>
                    </div>
                    <div className="space-y-2">
                       <Label htmlFor="phone" className="text-[10px] uppercase tracking-widest text-gray-500">Phone</Label>
                       <Input name="phone" value={newAddress.phone} onChange={handleAddressChange} className="bg-white border-gray-200 focus:border-black rounded-none h-12" />
                    </div>
                    <div className="flex gap-4 pt-4">
                      <Button onClick={handleSaveAddress} disabled={savingAddress} className="h-12 rounded-none bg-black text-white hover:bg-gray-800 text-[10px] font-bold uppercase tracking-widest px-8">
                        {savingAddress ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        Save Address
                      </Button>
                      {addresses.length > 0 && (
                        <Button variant="outline" onClick={() => setShowAddForm(false)} className="h-12 rounded-none border-gray-200 hover:border-black text-[10px] font-bold uppercase tracking-widest px-8">
                          Cancel
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-10 bg-gray-50 rounded-sm">
                     <p className="text-gray-400 text-sm mb-4">No address found.</p>
                     <Button onClick={() => setShowAddForm(true)} variant="outline" className="text-[10px] uppercase tracking-widest">Add Address</Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddress(addr)}
                        className={`p-6 border cursor-pointer transition-all duration-300 relative group ${
                          selectedAddress?.id === addr.id
                            ? "border-black bg-black text-white"
                            : "border-gray-200 hover:border-black text-gray-600 hover:text-black"
                        }`}
                      >
                        {selectedAddress?.id === addr.id && (
                           <div className="absolute top-4 right-4">
                              <Check className="h-4 w-4" />
                           </div>
                        )}
                        <p className="font-bold uppercase tracking-wide text-xs mb-2">
                          {addr.address.firstName} {addr.address.lastName}
                        </p>
                        <div className={`text-xs leading-relaxed opacity-80 ${selectedAddress?.id === addr.id ? 'text-gray-300' : 'text-gray-500'}`}>
                          <p>{addr.address.addressLine1}</p>
                          <p>{addr.address.city}, {addr.address.state} {addr.address.postalCode}</p>
                          <p className="mt-2">{addr.address.phone}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
             </section>
             
             {/* Payment Method - Placeholder for now */}
             <section className="opacity-50 pointer-events-none">
                 <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
                  <h3 className="text-xl font-bold uppercase tracking-widest flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 text-[10px] flex items-center justify-center">2</span>
                    Payment
                  </h3>
                 </div>
                 <div className="p-6 border border-gray-200">
                    <p className="text-xs uppercase tracking-widest text-gray-500">Credit Card (Default)</p>
                 </div>
             </section>

          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
             <div className="bg-gray-50 p-10 lg:sticky lg:top-32">
                <h3 className="text-xl font-bold uppercase tracking-wide mb-8 font-serif">Your Order</h3>
                
                 {cartItems.length === 0 ? (
                    <div className="text-center py-10">
                       <p className="text-gray-400 italic">Cart is empty</p>
                       <Link href="/products" className="text-[10px] font-bold uppercase tracking-widest mt-4 inline-block border-b border-black">Browse</Link>
                    </div>
                 ) : (
                    <>
                      <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2 scrollbar-hide">
                        {cartItems.map((item) => (
                           <div key={item.id} className="flex justify-between items-start gap-4">
                              <div className="flex-1">
                                 <p className="text-sm font-bold uppercase tracking-tight line-clamp-2">{item.title}</p>
                                 <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Qty: {item.quantity}</p>
                              </div>
                              <span className="text-sm font-medium font-serif">₹{Number(item.price * item.quantity).toFixed(2)}</span>
                           </div>
                        ))}
                      </div>

                      <div className="space-y-3 pt-6 border-t border-gray-200 text-xs font-bold uppercase tracking-widest text-gray-500">
                         <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span className="text-black">₹{Number(cartTotal).toFixed(2)}</span>
                         </div>
                         <div className="flex justify-between">
                            <span>Shipping</span>
                            <span className="text-black">Calculated next</span>
                         </div>
                      </div>
                      
                      <div className="flex justify-between items-center pt-6 mt-6 border-t border-black">
                         <span className="text-sm font-bold uppercase tracking-widest">Total</span>
                         <span className="text-2xl font-black font-serif">₹{Number(cartTotal).toFixed(2)}</span>
                      </div>
                      
                       <Button
                          size="lg"
                          className="w-full mt-8 h-16 rounded-none bg-black text-white hover:bg-[#1A3C34] font-bold uppercase tracking-[0.2em] text-xs transition-all shadow-xl hover:-translate-y-1"
                          onClick={handlePlaceOrder}
                          disabled={isPlacingOrder || !selectedAddress || cartItems.length === 0}
                        >
                          {isPlacingOrder ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-2" /> Processing...
                            </>
                          ) : (
                            "Place Order"
                          )}
                        </Button>
                        <p className="text-[10px] text-center text-gray-400 mt-4 leading-relaxed">
                           By placing this order, you agree to our Terms of Service and Privacy Policy. All sales are final.
                        </p>
                    </>
                 )}
             </div>
          </div>
        </div>
      </div>
        <style jsx global>{`
        @keyframes scale-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes check-draw {
          0% {
            stroke-dashoffset: 50;
            opacity: 0;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
