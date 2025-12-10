import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden border-none shadow-none hover:shadow-md transition-shadow">
      <div className="relative aspect-square overflow-hidden rounded-t-lg bg-muted">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        {product.isNew && (
          <Badge className="absolute left-2 top-2 bg-primary text-primary-foreground">
            New
          </Badge>
        )}
        {product.isTrending && !product.isNew && (
          <Badge variant="secondary" className="absolute left-2 top-2">
            Trending
          </Badge>
        )}
        <div className="absolute right-2 top-2 flex flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 rounded-full"
          >
            <Heart className="h-4 w-4" />
            <span className="sr-only">Add to wishlist</span>
          </Button>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="text-sm text-muted-foreground mb-1">
          {product.category}
        </div>
        <Link
          href={`/products/${product.id}`}
          className="font-semibold hover:underline line-clamp-1"
        >
          {product.name}
        </Link>
        <div className="mt-2 font-bold">${product.price.toFixed(2)}</div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full gap-2">
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
