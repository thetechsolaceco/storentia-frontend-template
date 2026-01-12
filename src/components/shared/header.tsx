"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Search, ShoppingBag, User, X, Menu } from "lucide-react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCart } from "@/hooks/useCart";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { selectStoreInfo } from "@/lib/store/storeSlice";
import { storeAPI, type StoreProduct } from "@/lib/apiClients";
import { useRouter, usePathname } from "next/navigation";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  // Search state
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<StoreProduct[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const isLandingPage = pathname === "/";
  const showSolidHeader = isScrolled || !isLandingPage;

  const storeInfo = useAppSelector(selectStoreInfo);
  const storeName = storeInfo?.name || "StoreKit";

  // Cart hook
  const { count: cartCount } = useCart();
  
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  useEffect(() => {
    setIsHydrated(true);
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem("user_data");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setIsUserAuthenticated(true);
        }
      } catch (e) {
        console.error("Auth check failed", e);
      }
    };
    checkAuth();

    // Listen for auth events
    window.addEventListener("auth-change", checkAuth);
    return () => window.removeEventListener("auth-change", checkAuth);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user_data");
    localStorage.removeItem("token");
    setUser(null);
    setIsUserAuthenticated(false);

    const event = new CustomEvent("auth-change");
    window.dispatchEvent(event);
    router.push("/");
  };

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      setSearchLoading(true);
      setShowSearchResults(true);
      try {
        const response = await storeAPI.getPublicProducts({ search: value, limit: 5 });
        if (response.success && response.data) {
           const products = Array.isArray(response.data) ? response.data : (response.data as any).products || [];
           setSearchResults(products);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setSearchLoading(false);
      }
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const navLinks = [
    { name: "Men's", href: "/products?gender=men" },
    { name: "Woman's", href: "/products?gender=women" },
    { name: "Kid's", href: "/products?gender=kids" },
    { name: "Accessories", href: "/products?category=accessories" },
    { name: "Gifts", href: "/products?category=gifts" },
  ];

  if (!isHydrated) return null;

  return (
    <motion.header
      className={cn(
        "fixed top-0 z-50 w-full border-b border-transparent transition-all duration-300",
        showSolidHeader ? "bg-white/80 backdrop-blur-md shadow-sm border-gray-100" : "bg-white/0"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container flex h-20 items-center justify-between">
        {/* Left: Logo */}
        <div className="shrink-0 flex items-center gap-4">
            {/* Mobile Menu */}
            <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px]">
              <SheetHeader className="mb-6 text-left">
                <SheetTitle className="text-2xl font-bold uppercase">MILAN</SheetTitle>
              </SheetHeader>
               <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="text-lg font-medium hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                  <div className="h-px bg-border my-2" />
                  <Link href="/products" className="text-lg font-medium hover:text-primary">
                    All Products
                  </Link>
               </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-2">
            <span className={cn("text-3xl font-extrabold tracking-tight uppercase transition-colors", showSolidHeader ? "text-black" : "text-black md:text-white")}>MILAN</span>
          </Link>
        </div>

        {/* Center: Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="relative group py-2">
              <span className={cn("text-sm font-bold uppercase tracking-widest transition-colors", showSolidHeader ? "text-black" : "text-white")}>
                {link.name}
              </span>
              <span className={cn("absolute bottom-0 left-0 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full", showSolidHeader ? "bg-black" : "bg-white")} />
            </Link>
          ))}
        </nav>

        {/* Right: Icons */}
        <div className="flex items-center gap-4">
          {/* Search */}
             <div className="relative hidden md:flex items-center" ref={searchRef}>
             <AnimatePresence>
                {showSearchResults && (
                    <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 250 }}
                        exit={{ opacity: 0, width: 0 }}
                        className="overflow-hidden mr-2"
                    >
                        <Input
                            placeholder="Search..."
                            value={query}
                            onChange={handleSearch}
                            className="h-9 w-full bg-transparent border-b border-gray-300 rounded-none px-0 focus-visible:ring-0 focus-visible:border-black text-sm"
                        />
                    </motion.div>
                )}
             </AnimatePresence>

             <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSearchResults(!showSearchResults)}
                className={cn("hover:bg-transparent", showSolidHeader ? "text-black" : "text-white")}
             >
                <Search className="h-5 w-5" />
             </Button>

            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white shadow-xl rounded-md border border-gray-100 overflow-hidden z-50">
                   {searchResults.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      onClick={() => setShowSearchResults(false)}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b last:border-0"
                    >
                       <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden shrink-0">
                          {product.images?.[0]?.url ? (
                            <Image
                              src={product.images[0].url}
                              alt={product.title}
                              width={40}
                              height={40}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                             <div className="w-full h-full flex items-center justify-center bg-gray-200 text-[10px]">img</div>
                          )}
                       </div>
                       <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-black line-clamp-1">{product.title}</p>
                          <p className="text-xs text-gray-500">${product.price}</p>
                       </div>
                    </Link>
                   ))}
              </div>
            )}
          </div>

          {/* Cart */}
          <Link href="/cart">
            <Button variant="ghost" size="icon" className={cn("relative hover:bg-transparent", showSolidHeader ? "text-black" : "text-white")}>
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] text-white">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>

          {/* User Profile */}
          {isUserAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className={cn("hover:bg-transparent", showSolidHeader ? "text-black" : "text-white")}>
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.firstName} {user.lastName}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/profile')}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/profile?tab=orders')}>
                  Orders
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex gap-2">
                 <Link href="/login">
                    <Button variant="ghost" size="sm" className={cn(showSolidHeader ? "text-black hover:text-black hover:bg-gray-100" : "text-white hover:text-white hover:bg-white/20")}>
                        Login
                    </Button>
                 </Link>
                 <Link href="/signup">
                    <Button variant="secondary" size="sm" className="rounded-full px-4">
                        Sign Up
                    </Button>
                 </Link>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
}
