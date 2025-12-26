"use client";

import { Hero } from "@/components/landing/hero";
import { StoreProductCarousel } from "@/components/landing/store-product-carousel";
import { Testimonials } from "@/components/landing/testimonials";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <StoreProductCarousel title="Trending Now" type="trending" limit={10} />
      <StoreProductCarousel title="Recommended For You" type="recommended" limit={10} />
      <Testimonials />
    </div>
  );
}
