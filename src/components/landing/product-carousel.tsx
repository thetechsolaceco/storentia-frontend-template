"use client";

import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ProductCard } from "@/components/shared/product-card";
import { type StoreProduct, addToCart as addToCartAPI, addToWishlist } from "@/lib/apiClients";
import { useCart } from "@/hooks/useCart";
import { useAppDispatch } from "@/lib/store/hooks";
import { addItem } from "@/lib/store/cartSlice";
import { isAuthenticated } from "@/lib/apiClients/store/authentication";

interface ProductCarouselProps {
  title: string;
  products: StoreProduct[];
}

export function ProductCarousel({ title, products }: ProductCarouselProps) {
  const dispatch = useAppDispatch();
  const { getItemQuantity, updateItemQuantity, addToCart, isAuth } = useCart();
  const [loadingWishlist, setLoadingWishlist] = useState<string | null>(null);

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

  return (
    <section className="py-16">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        </div>
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {products.map((product) => (
              <CarouselItem
                key={product.id}
                className="pl-4 md:basis-1/2 lg:basis-1/4"
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
                  cartQuantity={getItemQuantity(product.id)}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
