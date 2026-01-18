"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Search, ShoppingBag, User, X, Menu, Loader2, ArrowRight } from "lucide-react";
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
import { useAppSelector } from "@/lib/store/hooks";
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
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  
  // Cart hook
  const { count: cartCount } = useCart();
  
  // Handle scroll and route changes for header style
  const handleScroll = (latest: number) => {
    if (pathname !== "/") {
      setIsScrolled(true);
    } else {
      setIsScrolled(latest > 20);
    }
  };

  useMotionValueEvent(scrollY, "change", handleScroll);

  useEffect(() => {
    handleScroll(window.scrollY);
  }, [pathname]);

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
    window.addEventListener("auth-change", checkAuth);
    return () => window.removeEventListener("auth-change", checkAuth);
  }, []);

  // Click outside to close search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false);
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
    window.dispatchEvent(new CustomEvent("auth-change"));
    router.push("/");
  };

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      setSearchLoading(true);
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
    }
  };

  const navLinks = [
    { name: "Collections", href: "/collections" },
    { name: "Shop", href: "/products" },
  ];

  if (!isHydrated) return null;

  return (
    <motion.header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300 border-b border-transparent",
        isScrolled 
          ? "bg-white/90 backdrop-blur-md py-3 shadow-sm border-gray-100" 
          : "bg-transparent py-6"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container flex items-center justify-between">
        
        {/* Left: Mobile Menu & Logo */}
        <div className="flex items-center gap-4">
            <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className={cn("md:hidden hover:bg-black/5", isScrolled ? "text-black" : "text-white")}>
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] bg-white text-black border-r border-gray-100">
              <SheetHeader className="mb-8 text-left border-b border-gray-100 pb-4">
                <SheetTitle className="text-2xl font-black uppercase tracking-tighter text-black">STORENTIA</SheetTitle>
              </SheetHeader>
               <nav className="flex flex-col gap-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="text-lg font-medium hover:text-emerald-600 transition-colors flex items-center justify-between group"
                    >
                      {link.name}
                      <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-emerald-600" />
                    </Link>
                  ))}
               </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-2 group mr-4">
            <div className={cn("font-black font-serif text-xs px-2 py-1 rounded-sm transition-colors", isScrolled ? "bg-black text-white group-hover:bg-[#1A3C34]" : "bg-white text-black group-hover:bg-emerald-400")}>S</div>
            <span className={cn("text-xl md:text-2xl font-black font-serif tracking-tight uppercase transition-colors", isScrolled ? "text-black" : "text-white")}>STORENTIA</span>
          </Link>

          {/* Desktop Nav - Left Aligned */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className={cn("relative group text-sm font-bold font-sans uppercase tracking-widest transition-colors", isScrolled ? "text-gray-600 hover:text-black" : "text-gray-300 hover:text-white")}>
                {link.name}
                <span className={cn("absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full", isScrolled ? "bg-black" : "bg-white")} />
              </Link>
            ))}
          </nav>
        </div>

        {/* Center: Search Input */}
        <div className="hidden md:block flex-1 max-w-md mx-4 relative" ref={searchRef}>
           <div className="relative">
              <Input
                placeholder="Search products..."
                value={query}
                onChange={(e) => {
                    handleSearch(e);
                    if(e.target.value.length > 2) setShowSearch(true);
                }}
                onFocus={() => {
                   if(query.length > 2) setShowSearch(true);
                }}
                className={cn(
                    "w-full rounded-full pl-4 pr-10 focus-visible:ring-1 transition-colors font-sans h-10",
                     isScrolled 
                        ? "bg-gray-100 border-gray-200 text-black placeholder:text-gray-500 focus-visible:ring-black focus-visible:border-black"
                        : "bg-white/10 border-white/10 text-white placeholder:text-gray-400 focus-visible:ring-white focus-visible:border-white"
                )}
              />
              <div className={cn("absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none", isScrolled ? "text-gray-500" : "text-gray-400")}>
                 {searchLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              </div>
           </div>

           <AnimatePresence>
               {showSearch && query.length > 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl overflow-hidden z-50 origin-top"
                  >
                        {searchLoading ? (
                          <div className="p-4 flex justify-center text-[#1A3C34]">
                             <Loader2 className="animate-spin h-5 w-5" />
                          </div>
                        ) : searchResults.length > 0 ? (
                          <div className="max-h-[60vh] overflow-y-auto">
                           {searchResults.map((product) => (
                             <Link
                               key={product.id}
                               href={`/products/${product.id}`}
                               onClick={() => {
                                 setShowSearch(false);
                                 setQuery("");
                               }}
                               className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 group"
                             >
                                <div className="w-10 h-10 bg-gray-100 rounded-md overflow-hidden shrink-0">
                                   {product.images?.[0]?.url ? (
                                     <Image
                                       src={product.images[0].url}
                                       alt={product.title}
                                       width={40}
                                       height={40}
                                       className="object-cover w-full h-full"
                                     />
                                   ) : (
                                      <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">img</div>
                                   )}
                                </div>
                                <div className="flex-1 min-w-0">
                                   <p className="text-sm font-medium font-serif text-black group-hover:text-[#1A3C34] truncate transition-colors">{product.title}</p>
                                   <p className="text-xs text-gray-500 font-sans">${Number(product.price).toFixed(2)}</p>
                                </div>
                             </Link>
                            ))}
                          </div>
                        ) : (
                           <div className="p-4 text-center text-xs text-gray-500 uppercase tracking-wider font-sans">No results found</div>
                        )}
                        <div className="bg-gray-50 p-2 text-center">
                         <Link 
                            href={`/products?search=${encodeURIComponent(query)}`}
                            onClick={() => setShowSearch(false)}
                            className="text-[10px] uppercase font-bold tracking-widest text-black hover:text-[#1A3C34] hover:underline"
                         >
                            View All Results
                         </Link>
                      </div>
                  </motion.div>
               )}
           </AnimatePresence>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/cart">
            <Button variant="ghost" size="icon" className={cn("relative rounded-full w-10 h-10 hover:bg-black/5", isScrolled ? "text-black" : "text-white hover:bg-white/10")}>
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-[#1A3C34] text-[10px] font-bold text-white border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>

          {/* User Profile */}
          {isUserAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className={cn("rounded-full w-10 h-10 hover:bg-black/5", isScrolled ? "text-black" : "text-white hover:bg-white/10")}>
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white border-gray-100 text-black shadow-xl">
                <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none font-serif">{user.firstName} {user.lastName}</p>
                        <p className="text-xs leading-none text-gray-500 font-sans">{user.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-100" />
                <DropdownMenuItem onClick={() => router.push('/profile')} className="focus:bg-gray-100 focus:text-[#1A3C34] cursor-pointer font-sans">
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/profile?tab=orders')} className="focus:bg-gray-100 focus:text-[#1A3C34] cursor-pointer font-sans">
                  Orders
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-100" />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer font-sans">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex gap-2">
                 <Link href="/login">
                    <Button variant="ghost" size="sm" className={cn("rounded-full px-6 font-medium hover:bg-black/5 font-sans", isScrolled ? "text-black hover:text-[#1A3C34]" : "text-white hover:text-emerald-400 hover:bg-white/10")}>
                        Login
                    </Button>
                 </Link>
                 <Link href="/signup">
                    <Button variant="default" size="sm" className={cn("rounded-full px-6 font-bold shadow-lg shadow-black/10 transition-all font-sans", isScrolled ? "bg-[#1A3C34] text-white hover:bg-[#142e28]" : "bg-white text-[#1A3C34] hover:bg-emerald-400")}>
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
