import { 
  AdminProduct, 
  AdminOrder, 
  AdminCustomer, 
  AdminCategory, 
  AdminCoupon, 
  AdminBanner, 
  AdminTestimonial,
  KPI 
} from "@/types/admin";

export const kpiData: KPI[] = [
  { label: "Total Revenue", value: "$45,231.89", change: 20.1, trend: "up" },
  { label: "Total Orders", value: "2,345", change: 15.2, trend: "up" },
  { label: "Active Users", value: "1,234", change: 5.4, trend: "up" },
  { label: "Conversion Rate", value: "3.2%", change: -1.2, trend: "down" },
];

export const revenueData = [
  { name: "Jan", total: 1500 },
  { name: "Feb", total: 2300 },
  { name: "Mar", total: 3200 },
  { name: "Apr", total: 4500 },
  { name: "May", total: 3800 },
  { name: "Jun", total: 5200 },
  { name: "Jul", total: 4800 },
];

export const recentOrders: AdminOrder[] = [
  { id: "ORD-001", customer: "John Doe", email: "john@example.com", total: 120.50, status: "delivered", date: "2023-12-01", items: 3 },
  { id: "ORD-002", customer: "Jane Smith", email: "jane@example.com", total: 75.00, status: "processing", date: "2023-12-02", items: 1 },
  { id: "ORD-003", customer: "Bob Johnson", email: "bob@example.com", total: 250.00, status: "pending", date: "2023-12-02", items: 5 },
  { id: "ORD-004", customer: "Alice Brown", email: "alice@example.com", total: 45.99, status: "shipped", date: "2023-12-03", items: 2 },
  { id: "ORD-005", customer: "Charlie Wilson", email: "charlie@example.com", total: 199.99, status: "cancelled", date: "2023-12-03", items: 1 },
];

export const products: AdminProduct[] = [
  { id: "PROD-001", name: "Classic White Tee", sku: "TS-001", price: 29.99, stock: 150, category: "Clothing", status: "active", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&auto=format&fit=crop" },
  { id: "PROD-002", name: "Denim Jacket", sku: "JK-002", price: 89.99, stock: 45, category: "Clothing", status: "active", image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=100&auto=format&fit=crop" },
  { id: "PROD-003", name: "Leather Sneakers", sku: "SH-003", price: 120.00, stock: 12, category: "Footwear", status: "active", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100&auto=format&fit=crop" },
  { id: "PROD-004", name: "Summer Dress", sku: "DR-004", price: 59.50, stock: 0, category: "Clothing", status: "draft", image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=100&auto=format&fit=crop" },
  { id: "PROD-005", name: "Wireless Headphones", sku: "EL-005", price: 199.99, stock: 8, category: "Electronics", status: "active", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&auto=format&fit=crop" },
];

export const customers: AdminCustomer[] = [
  { id: "CUST-001", name: "John Doe", email: "john@example.com", totalSpent: 1200.50, ordersCount: 15, status: "active", joinDate: "2023-01-15" },
  { id: "CUST-002", name: "Jane Smith", email: "jane@example.com", totalSpent: 850.00, ordersCount: 8, status: "active", joinDate: "2023-02-20" },
  { id: "CUST-003", name: "Bob Johnson", email: "bob@example.com", totalSpent: 0.00, ordersCount: 0, status: "banned", joinDate: "2023-11-05" },
];

export const categories: AdminCategory[] = [
  { id: "CAT-001", name: "Clothing", slug: "clothing", productsCount: 120, image: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=100&auto=format&fit=crop" },
  { id: "CAT-002", name: "Footwear", slug: "footwear", productsCount: 45, image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100&auto=format&fit=crop" },
  { id: "CAT-003", name: "Electronics", slug: "electronics", productsCount: 80, image: "https://images.unsplash.com/photo-1498049381145-06f438a1c0a3?w=100&auto=format&fit=crop" },
  { id: "CAT-004", name: "Accessories", slug: "accessories", productsCount: 65, image: "https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?w=100&auto=format&fit=crop" },
];

export const coupons: AdminCoupon[] = [
  { id: "CPN-001", code: "WELCOME10", discount: "10%", usage: 150, status: "active", expiryDate: "2024-12-31" },
  { id: "CPN-002", code: "SUMMER20", discount: "20%", usage: 45, status: "expired", expiryDate: "2023-08-31" },
  { id: "CPN-003", code: "BLACKFRIDAY", discount: "50%", usage: 500, status: "active", expiryDate: "2024-11-29" },
];

export const banners: AdminBanner[] = [
  { id: "BNR-001", title: "Summer Sale", image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400&auto=format&fit=crop", status: "active", link: "/products?category=summer" },
  { id: "BNR-002", title: "New Arrivals", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&auto=format&fit=crop", status: "active", link: "/products?sort=newest" },
];

export const testimonials: AdminTestimonial[] = [
  { id: "TST-001", name: "Sarah Connor", role: "Verified Buyer", content: "Amazing quality! I love the fabric and the fit is perfect.", rating: 5, status: "approved", avatar: "SC" },
  { id: "TST-002", name: "Kyle Reese", role: "Customer", content: "Shipping was a bit slow, but the product is good.", rating: 4, status: "pending", avatar: "KR" },
  { id: "TST-003", name: "T-800", role: "Robot", content: "I'll be back... for more shopping.", rating: 5, status: "rejected", avatar: "T8" },
];
