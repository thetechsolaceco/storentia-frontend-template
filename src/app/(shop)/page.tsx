import { Hero } from "@/components/landing/hero";
import { ProductCarousel } from "@/components/landing/product-carousel";
import { Testimonials } from "@/components/landing/testimonials";
import productsData from "@/data/products.json";
import { Product } from "@/types";

export default function Home() {
  const products = productsData as Product[];
  const trendingProducts = products.filter((p) => p.isTrending);
  const newProducts = products.filter((p) => p.isNew);

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <ProductCarousel title="Trending Now" products={trendingProducts} />
      <ProductCarousel title="New Arrivals" products={newProducts} />
      <Testimonials />
    </div>
  );
}
