import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative bg-muted/40 py-20 md:py-32 overflow-hidden">
      <div className="container relative z-10 flex flex-col items-center text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Elevate Your Style <br className="hidden sm:inline" />
          <span className="text-primary">With StoreKit</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Discover the latest trends in fashion, electronics, and accessories.
          Premium quality products curated just for you.
        </p>
        <div className="mt-10 flex gap-4">
          <Link href="/products">
            <Button size="lg" className="h-12 px-8 text-base">
              Shop Now
            </Button>
          </Link>
          <Link href="/about">
            <Button variant="outline" size="lg" className="h-12 px-8 text-base">
              Learn More
            </Button>
          </Link>
        </div>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />
    </section>
  );
}
