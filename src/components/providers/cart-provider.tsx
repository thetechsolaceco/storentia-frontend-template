"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  initializeCart,
  addItem as addLocalItem,
  removeItem as removeLocalItem,
  updateQuantity as updateLocalQuantity,
  clearCart as clearLocalCart,
  selectCartItems,
  selectCartTotal,
  selectCartCount,
  selectIsLoading,
  selectCartInitialized,
  type CartItem,
} from "@/lib/store/cartSlice";
import { StoreProduct } from "@/lib/apiClients/store";
import { isAuthenticated } from "@/lib/apiClients/store/authentication";
import {
  getCart,
  addToCart as addToCartAPI,
  removeFromCart as removeFromCartAPI,
  updateCartItemQuantity,
  type CartItem as APICartItem,
} from "@/lib/apiClients/store/cart";

// Define the shape of the Context
interface CartContextType {
  items: CartItem[];
  total: number;
  count: number;
  isLoading: boolean;
  initialized: boolean;
  isAuth: boolean;
  addToCart: (product: StoreProduct, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateItemQuantity: (productId: string, quantity: number) => Promise<void>;
  clearAllItems: () => void;
  getItemQuantity: (productId: string) => number;
  isInCart: (productId: string) => boolean;
  refreshApiCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface APICartState {
  items: Array<{
    id: string; // Cart Item ID
    productId: string;
    quantity: number;
  }>;
  count: number;
  loading: boolean;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const localItems = useAppSelector(selectCartItems);
  const localTotal = useAppSelector(selectCartTotal);
  const localCount = useAppSelector(selectCartCount);
  const localIsLoading = useAppSelector(selectIsLoading);
  const localInitialized = useAppSelector(selectCartInitialized);

  // Auth-aware state
  const [isAuth, setIsAuth] = useState(false);
  const [apiCart, setApiCart] = useState<APICartState>({
    items: [],
    count: 0,
    loading: false,
  });

  // Check auth status and fetch API cart if authenticated
  const checkAuthAndFetchCart = useCallback(async () => {
    const authenticated = isAuthenticated();
    setIsAuth(authenticated);

    if (authenticated) {
      // Don't set loading to true here to avoid flickering if we are just refreshing silently
      // But initial load might need it. We can handle 'initialized' separate.
      try {
        const result = await getCart();
        if (result.success && result.data?.cartItems) {
          const items = result.data.cartItems
            .map((item: APICartItem) => ({
              id: item.id,
              // Handle nested product structure if necessary, similar to previous fix
              productId: item.productId || item.product?.id || "",
              quantity: item.quantity,
            }))
            .filter((item) => item.productId);

          const count = items.reduce((sum, item) => sum + item.quantity, 0);
          setApiCart({ items, count, loading: false });
        } else {
          setApiCart({ items: [], count: 0, loading: false });
        }
      } catch (error) {
        console.error("Failed to fetch API cart:", error);
        setApiCart({ items: [], count: 0, loading: false });
      }
    }
  }, []);

  // Initial Fetch & Event Listeners
  useEffect(() => {
    checkAuthAndFetchCart();

    const handleAuthChange = () => checkAuthAndFetchCart();
    
    // We can keep 'cart-update' listener if other parts of app dispatch it
    // But since we are centrally managing it, we might not need it as much, 
    // strictly speaking, except for cross-tab sync if we wanted.
    const handleCartUpdate = () => {
        if (isAuthenticated()) checkAuthAndFetchCart();
    };

    window.addEventListener("auth-change", handleAuthChange);
    window.addEventListener("cart-update", handleCartUpdate);

    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
      window.removeEventListener("cart-update", handleCartUpdate);
    };
  }, [checkAuthAndFetchCart]);

  // Initialize local cart for guests
  useEffect(() => {
    if (!localInitialized && !isAuth) {
      dispatch(initializeCart());
    }
  }, [dispatch, localInitialized, isAuth]);


  // --- Actions ---

  const refreshApiCart = useCallback(async () => {
    if (!isAuthenticated()) return;
    await checkAuthAndFetchCart();
  }, [checkAuthAndFetchCart]);

  const addToCart = useCallback(
    (product: StoreProduct, quantity: number = 1) => {
      if (isAuth) {
          // If authenticated, 'addToCart' from UI usually implies adding a new item.
          // We can reuse updateItemQuantity logic or direct add.
          // Since updateItemQuantity handles the delta, we should check if item exists.
          
          const existingItem = apiCart.items.find(i => i.productId === product.id);
          const currentQty = existingItem?.quantity || 0;
          
          // Optimistic update would be handled in updateItemQuantity if we route through there.
          // Let's route through updateItemQuantity to keep logic centralized.
          updateItemQuantity(product.id, currentQty + quantity);
      } else {
          // Guest
          const cartItem: CartItem = {
            id: `local_${product.id}_${Date.now()}`,
            productId: product.id,
            title: product.title,
            price: Number(product.price),
            quantity,
            image: product.images?.[0]?.url,
          };
          dispatch(addLocalItem(cartItem));
      }
    },
    [dispatch, isAuth, apiCart.items] // Added dependency to apiCart.items to check existence
  );

  const removeFromCart = useCallback(
    (productId: string) => {
       if (isAuth) {
           // Route through updateItemQuantity(0) which handles DELETE
           updateItemQuantity(productId, 0);
       } else {
           dispatch(removeLocalItem(productId));
       }
    },
    [dispatch, isAuth]
  );

  const updateItemQuantity = useCallback(
    async (productId: string, quantity: number) => {
      if (isAuth) {
        const item = apiCart.items.find((i) => i.productId === productId);
        // const currentQty = item?.quantity || 0;
        // const delta = quantity - currentQty;

        // if (delta === 0) return;

        // --- Optimistic Update ---
        // 1. Snapshot previous state
        const previousCart = { ...apiCart };

        // 2. Update local state immediately
        setApiCart((prev) => {
           let newItems;
           if (quantity < 1) {
               // Remove item
               newItems = prev.items.filter(i => i.productId !== productId);
           } else {
               if (item) {
                   // Update existing
                   newItems = prev.items.map(i => i.productId === productId ? { ...i, quantity } : i);
               } else {
                   // Add new
                   newItems = [...prev.items, { id: 'temp-opt-id', productId, quantity }];
               }
           }
           const newCount = newItems.reduce((sum, i) => sum + i.quantity, 0);
           return { ...prev, items: newItems, count: newCount };
        });

        // 3. Perform API Call
        try {
          if (quantity < 1) {
            // DELETE
            if (item?.id) {
               const result = await removeFromCartAPI(item.id);
               if (!result.success) throw new Error(result.error);
            }
          } else {
            // If item exists (has ID), use PUT (Update)
            if (item?.id) {
               const result = await updateCartItemQuantity(item.id, quantity);
               if (!result.success) throw new Error(result.error);
            } else {
               // If new item, use POST (Add)
               const result = await addToCartAPI({ productId, quantity });
               if (!result.success) throw new Error(result.error);
            }
          }
          // Silent refresh
           await checkAuthAndFetchCart(); 
        } catch (error) {
           console.error("Failed to update cart (optimistic revert):", error);
           // 4. Revert on failure
           setApiCart(previousCart);
        }
      } else {
          // Guest
          if (quantity < 1) {
            dispatch(removeLocalItem(productId));
          } else {
            dispatch(updateLocalQuantity({ productId, quantity }));
          }
      }
    },
    [dispatch, isAuth, apiCart, checkAuthAndFetchCart]
  );
  
  const clearAllItems = useCallback(() => {
    dispatch(clearLocalCart());
    // TODO: Implement API clear if exists/needed for auth user
  }, [dispatch]);

  const getItemQuantity = useCallback(
    (productId: string): number => {
      if (isAuth) {
        const item = apiCart.items.find((i) => i.productId === productId);
        return item?.quantity || 0;
      }
      const item = localItems.find((i) => i.productId === productId);
      return item?.quantity || 0;
    },
    [isAuth, apiCart.items, localItems]
  );

  const isInCart = useCallback(
    (productId: string): boolean => {
      if (isAuth) {
        return apiCart.items.some((i) => i.productId === productId);
      }
      return localItems.some((i) => i.productId === productId);
    },
    [isAuth, apiCart.items, localItems]
  );

  // Derived values
  const items = isAuth ? [] : localItems; // We expose empty array for items for auth user mostly because they are not fully populated with product details in this 'lite' state? 
  // Wait, `items` in context should probably return something useful.
  // The local CartItem has full details (title, image). The API CartItem only has IDs and qty in 'apiCart' state.
  // If we want to show a cart drawer, we need full details.
  // `useCart` previously returned `items = isAuth ? [] : localItems`.
  // This implies the consuming component fetches expanded cart details separately (e.g. via `getCart` in the Cart Page).
  // Ideally, `apiCart` should store full items if possible, or we follow existing pattern.
  // Existing pattern in `useCart.ts`: `const items = isAuth ? [] : localItems;`
  // So we will stick to that to avoid breaking changes in behavior.
  
  const total = isAuth ? 0 : localTotal; // API doesn't give total in the lightweight map, only count.
  const count = isAuth ? apiCart.count : localCount;
  const isLoading = isAuth ? apiCart.loading : localIsLoading;
  const initialized = isAuth ? !apiCart.loading : localInitialized;

  const contextValue = useMemo(() => ({
    items,
    total,
    count,
    isLoading,
    initialized,
    isAuth,
    addToCart,
    removeFromCart,
    updateItemQuantity,
    clearAllItems,
    getItemQuantity,
    isInCart,
    refreshApiCart
  }), [
    items, total, count, isLoading, initialized, isAuth,
    addToCart, removeFromCart, updateItemQuantity, clearAllItems, getItemQuantity, isInCart, refreshApiCart
  ]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
}
