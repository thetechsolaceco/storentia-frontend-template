export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface AdminProduct {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  status: 'active' | 'draft' | 'archived';
  image: string;
}

export interface AdminOrder {
  id: string;
  customer: string;
  email: string;
  total: number;
  status: OrderStatus;
  date: string;
  items: number;
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  totalSpent: number;
  ordersCount: number;
  status: 'active' | 'banned';
  joinDate: string;
}

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  productsCount: number;
  image: string;
}

export interface AdminCoupon {
  id: string;
  code: string;
  discount: string;
  usage: number;
  status: 'active' | 'expired';
  expiryDate: string;
}

export interface AdminBanner {
  id: string;
  title: string;
  image: string;
  status: 'active' | 'inactive';
  link: string;
}

export interface AdminTestimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  status: 'approved' | 'pending' | 'rejected';
  avatar: string;
}

export interface KPI {
  label: string;
  value: string | number;
  change: number; // percentage
  trend: 'up' | 'down' | 'neutral';
}
