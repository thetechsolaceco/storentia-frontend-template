import Link from "next/link";
import { ProductCard } from "@/components/shared/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import productsData from "@/data/products.json";
import { Product } from "@/types";

export default function ProductsPage() {
  const products = productsData as Product[];

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Filters</h3>
            <div className="space-y-4">
              <div>
                <Label>Search</Label>
                <Input placeholder="Search products..." className="mt-1" />
              </div>
              <Separator />
              <div>
                <Label>Category</Label>
                <div className="space-y-2 mt-2">
                  {["Clothing", "Electronics", "Footwear", "Accessories"].map(
                    (cat) => (
                      <div key={cat} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={cat}
                          className="rounded border-gray-300"
                        />
                        <label htmlFor={cat} className="text-sm">
                          {cat}
                        </label>
                      </div>
                    )
                  )}
                </div>
              </div>
              <Separator />
              <div>
                <Label>Price Range</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Input type="number" placeholder="Min" className="w-20" />
                  <span>-</span>
                  <Input type="number" placeholder="Max" className="w-20" />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">All Products</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <Select defaultValue="featured">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
