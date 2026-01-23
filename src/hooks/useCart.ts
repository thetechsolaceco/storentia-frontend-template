"use client";

import { useCartContext } from "@/components/providers/cart-provider";

export function useCart() {
  return useCartContext();
}
