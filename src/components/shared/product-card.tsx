import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { type StoreProduct } from "@/lib/apiClients";
import { Loader2, Heart, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: StoreProduct;
  onAddToCart?: (e: React.MouseEvent<HTMLButtonElement>, product: StoreProduct) => void;
  onUpdateQuantity?: (e: React.MouseEvent<HTMLButtonElement>, product: StoreProduct, quantity: number) => void;
  onAddToWishlist?: (e: React.MouseEvent<HTMLButtonElement>, productId: string) => void;
  loading?: boolean;
  loadingWishlist?: boolean;
  priority?: boolean;
  className?: string;
  cartQuantity?: number;
}

export function ProductCard({ product, onAddToCart, onUpdateQuantity, onAddToWishlist, loading, loadingWishlist, priority = false, className, cartQuantity = 0 }: ProductCardProps) {
  return (
    <div className={cn("group relative cursor-pointer", className)}>
      <div className="aspect-3/4 w-full overflow-hidden rounded-2xl bg-gray-100 relative mb-4">
        {/* Main Link covers the image area except the button */}
        <Link href={`/products/${product.id}`} className="absolute inset-0 z-0">
          <span className="sr-only">View {product.title}</span>
        </Link>
        
        {product.images?.[0]?.url ? (
          <Image
            src={product.images[0].url}
            alt={product.title}
            fill
            priority={priority}
            className={cn(
              "object-cover transition-transform duration-700 ease-in-out group-hover:scale-110",
              (product.stock ?? 0) <= 0 && "grayscale opacity-80"
            )}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10 pointer-events-none">
            {/* Out of Stock Badge */}
            {(product.stock ?? 0) <= 0 && (
               <div className="px-3 py-1.5 bg-black/95 text-white text-[10px] font-bold uppercase tracking-[0.2em] shadow-2xl border border-white/10">
                  Sold Out
               </div>
            )}
            
            {/* Low Stock Badge */}
            {(product.stock ?? 0) > 0 && (product.stock ?? 0) < 5 && (
               <div className="px-2.5 py-1 bg-amber-200/90 text-amber-900 text-[9px] font-bold uppercase tracking-[0.2em] rounded-sm shadow-sm border border-amber-900/10 backdrop-blur-sm">
                  Low Stock
               </div>
            )}

            {/* Already Added Badge */}
            {cartQuantity > 0 && (
               <div className="px-2.5 py-1 bg-white/95 text-black text-[9px] font-bold uppercase tracking-[0.2em] rounded-sm flex items-center gap-1.5 shadow-xl ring-1 ring-black/5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  In Cart
               </div>
            )}
        </div>
        
        {/* Wishlist Button */}
        {onAddToWishlist && (
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onAddToWishlist(e, product.id);
                }}
                className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white text-black translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10 shadow-sm"
            >
                {loadingWishlist ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin block" />
                ) : (
                    <Heart className="h-3.5 w-3.5 block hover:fill-red-500 hover:text-red-500 transition-colors" />
                )}
            </button>
        )}
        
        {/* Add to Cart / Quantity Control */}
        <div className={cn(
             "absolute bottom-4 left-4 right-4 transition-all duration-300 ease-out z-10",
             cartQuantity > 0 ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
        )}>
           {!loading && cartQuantity > 0 ? (
             <div className="flex items-center justify-between bg-white text-black shadow-xl rounded-full h-10 px-1 border border-black/5 dark:border-white/10 w-full overflow-hidden">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onUpdateQuantity) onUpdateQuantity(e, product, cartQuantity - 1);
                  }}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-gray-100 rounded-full shrink-0"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                
                <span className="font-bold font-mono text-xs w-8 text-center">{cartQuantity}</span>
                
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                     if (onUpdateQuantity) onUpdateQuantity(e, product, cartQuantity + 1);
                  }}
                  variant="ghost"
                  size="icon"
                  disabled={cartQuantity >= (product.stock ?? 0)}
                  className="h-8 w-8 hover:bg-gray-100 rounded-full shrink-0 disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <Plus className="h-3 w-3" />
                </Button>
             </div>
           ) : (
            <Button 
              onClick={(e) => {
                 e.stopPropagation(); // Prevent link click
                 if (onAddToCart) {
                     onAddToCart(e, product);
                 }
              }}
              disabled={loading || product.status !== "ACTIVE" || (product.stock ?? 0) <= 0}
              className={cn(
                  "w-full rounded-full font-bold font-sans uppercase tracking-wider text-[10px] shadow-xl h-10 border transition-all duration-300",
                  (product.stock ?? 0) <= 0 
                    ? "bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed" // Disabled Style
                    : "bg-black text-white hover:bg-[#1A1A1A] border-transparent hover:scale-[1.02] active:scale-[0.98]" // Active Style
              )}
            >
               {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : ((product.stock ?? 0) <= 0 ? "Sold Out" : "Add to Cart")}
            </Button>
           )}
        </div>
      </div>
      
      <div className="text-center space-y-1">
        <Link href={`/products/${product.id}`} className="block">
           <h3 className="text-sm font-bold font-serif uppercase tracking-wide text-black line-clamp-1 group-hover:text-gray-600 transition-colors">{product.title}</h3>
        </Link>
        <p className="text-sm font-medium font-sans text-gray-900">₹{Number(product.price).toFixed(2)}</p>
      </div>
    </div>
  );
}
