export const API_ENDPOINTS = {
  AUTH_VALIDATE_KEY: "/auth/key/validate",
  AUTH_GOOGLE: "/auth/google",
  AUTH_GOOGLE_CALLBACK: "/auth/google/callback",

  STORE_GET: "/store",
  STORE_UPDATE: "/store",

  PRODUCTS_GET_ALL: "/products",
  PRODUCTS_GET_BY_ID: "/products",
  PRODUCTS_CREATE: "/products",
  PRODUCTS_UPDATE: "/products",
  PRODUCTS_DELETE: "/products",

  ORDERS_GET_ALL: "/orders",
  ORDERS_GET_BY_ID: "/orders",
  ORDERS_UPDATE_STATUS: "/orders/status",

  CUSTOMERS_GET_ALL: "/customers",
  CUSTOMERS_GET_BY_ID: "/customers",

  CATEGORIES_GET_ALL: "/categories",
  CATEGORIES_CREATE: "/categories",
  CATEGORIES_UPDATE: "/categories",
  CATEGORIES_DELETE: "/categories",

  COUPONS_GET_ALL: "/coupons",
  COUPONS_CREATE: "/coupons",
  COUPONS_UPDATE: "/coupons",
  COUPONS_DELETE: "/coupons",

  BANNERS_GET_ALL: "/banners",
  BANNERS_CREATE: "/banners",
  BANNERS_UPDATE: "/banners",
  BANNERS_DELETE: "/banners",

  ANALYTICS_OVERVIEW: "/analytics/overview",
  ANALYTICS_SALES: "/analytics/sales",
  ANALYTICS_TRAFFIC: "/analytics/traffic",
} as const;
