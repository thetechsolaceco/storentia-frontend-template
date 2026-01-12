"use client";

import { Hero } from "@/components/landing/hero";
import { FeaturedCollections } from "@/components/landing/featured-collections";
import { ProductGrid } from "@/components/landing/product-grid";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Hero />
      <FeaturedCollections />
      <ProductGrid 
        title="New Arrivals" 
        subtitle="Latest collections for the season" 
        type="latest" 
        limit={10} 
      />
      <ProductGrid 
        title="Trending Now" 
        subtitle="In the right outfit anything is possible" 
        type="trending" 
        limit={10} 
      />
    </div>
  );
}
