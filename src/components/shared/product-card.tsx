import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { type StoreProduct } from "@/lib/apiClients";
import { Loader2, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: StoreProduct;
  onAddToCart?: (e: React.MouseEvent<HTMLButtonElement>, product: StoreProduct) => void;
  onAddToWishlist?: (e: React.MouseEvent<HTMLButtonElement>, productId: string) => void;
  loading?: boolean;
  loadingWishlist?: boolean;
  priority?: boolean;
  className?: string;
}

export function ProductCard({ product, onAddToCart, onAddToWishlist, loading, loadingWishlist, priority = false, className }: ProductCardProps) {
  return (
    <div className={cn("group relative cursor-pointer", className)}>
      <div className="aspect-[3/4] w-full overflow-hidden rounded-2xl bg-gray-100 relative mb-4">
        {product.images?.[0]?.url ? (
          <Image
            src={product.images[0].url}
            alt={product.title}
            fill
            priority={priority}
            className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
        )}

        {/* Main Link covers the image area except the button */}
        <Link href={`/products/${product.id}`} className="absolute inset-0 z-[5]">
          <span className="sr-only">View {product.title}</span>
        </Link>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-[4]" />
        
        {/* Wishlist Button */}
        {onAddToWishlist && (
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onAddToWishlist(e, product.id);
                }}
                className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white text-black translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10"
            >
                {loadingWishlist ? (
                    <Loader2 className="h-3 w-3 animate-spin block" />
                ) : (
                    <Heart className="h-3 w-3 block hover:fill-red-500 hover:text-red-500 transition-colors" />
                )}
            </button>
        )}
        
        {/* Add to Cart Button */}
        <div className="absolute bottom-4 left-4 right-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out z-10">
            <Button 
              onClick={(e) => {
                 e.stopPropagation(); // Prevent link click
                 if (onAddToCart) {
                     onAddToCart(e, product);
                 }
              }}
              disabled={loading || product.status !== "ACTIVE"}
              className="w-full rounded-full bg-[#1A3C34] text-white hover:bg-[#142e28] hover:text-white font-bold font-sans uppercase tracking-wider text-xs shadow-lg h-10 border-none"
            >
               {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Add to Cart"}
            </Button>
        </div>
      </div>
      
      <div className="text-center space-y-1">
        <Link href={`/products/${product.id}`} className="block">
           <h3 className="text-sm font-bold font-serif uppercase tracking-wide text-black line-clamp-1 group-hover:text-gray-600 transition-colors">{product.title}</h3>
        </Link>
        <p className="text-sm font-medium font-sans text-gray-900">${Number(product.price).toFixed(2)}</p>
      </div>
    </div>
  );
}
