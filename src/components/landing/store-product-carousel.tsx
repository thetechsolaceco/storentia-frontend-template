"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { storeAPI, type StoreProduct } from "@/lib/apiClients";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { addItem, updateQuantity, selectCartItems } from "@/lib/store/cartSlice";

interface StoreProductCarouselProps {
  title: string;
  type: "trending" | "recommended";
  limit?: number;
}

export function StoreProductCarousel({ title, type, limit = 10 }: StoreProductCarouselProps) {
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);

  useEffect(() => {
    const fetchProducts = async () => {
      const result = type === "trending" 
        ? await storeAPI.getTrendingProducts(limit)
        : await storeAPI.getRecommendedProducts(limit);
      
      if (result.success && result.data) {
        setProducts(result.data);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [type, limit]);

  const getCartItem = (productId: string) => {
    return cartItems.find((item) => item.productId === productId);
  };

  const handleAddToCart = (product: StoreProduct) => {
    dispatch(addItem({
      id: `cart-${product.id}`,
      productId: product.id,
      title: product.title,
      price: Number(product.price),
      image: product.images[0]?.url || "/placeholder.svg",
      quantity: 1,
    }));
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    dispatch(updateQuantity({ productId, quantity: newQuantity }));
  };

  if (loading) {
    return (
      <section className="py-16">
        <div className="container">
          <Skeleton className="h-9 w-48 mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        </div>
        <Carousel opts={{ align: "start" }} className="w-full">
          <CarouselContent className="-ml-4">
            {products.map((product) => {
              const cartItem = getCartItem(product.id);
              const imageUrl = product.images[0]?.url || "/placeholder.svg";

              return (
                <CarouselItem key={product.id} className="pl-4 md:basis-1/2 lg:basis-1/4">
                  <Card className="group overflow-hidden border-none shadow-none hover:shadow-md transition-shadow">
                    <div className="relative aspect-square overflow-hidden rounded-t-lg bg-muted">
                      <Image
                        src={imageUrl}
                        alt={product.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-4">
                      <Link
                        href={`/products/${product.id}`}
                        className="font-semibold hover:underline line-clamp-1"
                      >
                        {product.title}
                      </Link>
                      <div className="mt-2 font-bold">₹{Number(product.price).toFixed(2)}</div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      {cartItem ? (
                        <div className="flex items-center justify-between w-full gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9"
                            onClick={() => handleUpdateQuantity(product.id, cartItem.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="font-medium">{cartItem.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9"
                            onClick={() => handleUpdateQuantity(product.id, cartItem.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button className="w-full gap-2" onClick={() => handleAddToCart(product)}>
                          <ShoppingCart className="h-4 w-4" />
                          Add to Cart
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
