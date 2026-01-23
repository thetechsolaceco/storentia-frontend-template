import { BASE_URL } from "../shared";
import { getStoreData } from "../auth";

export interface OrderItem {
  productId: string;
  title?: string;
  quantity: number;
  price: number | string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
}

export interface PaymentInfo {
  method: "card" | "paypal" | "COD";
  cardNumber?: string;
  expiry?: string;
  cvc?: string;
}

export interface CreateOrderRequest {
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  contact: ContactInfo;
  payment: PaymentInfo;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  storeId?: string;
  storeName?: string;
  items: OrderItem[];
  total: number | string;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  paymentMethod?: string;
  paymentStatus?: string;
  shippingAddress?: ShippingAddress;
  contact?: ContactInfo;
  createdAt: string;
  updatedAt?: string;
}

export interface OrdersResponse {
  success: boolean;
  data?: Order[];
  message?: string;
}

export interface CreateOrderResponse {
  success: boolean;
  data?: Order;
  message?: string;
}

function getStoreId(): string {
  const storeData = getStoreData();
  const storeId = storeData?.storeId || storeData?.store?.id;
  if (!storeId) {
    throw new Error("Store ID not found.");
  }
  return storeId;
}

export async function createOrder(
  orderData: CreateOrderRequest,
  storeId?: string
): Promise<CreateOrderResponse> {
  try {
    const id = storeId || getStoreId();
    const response = await fetch(`${BASE_URL}/store/${id}/order`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return {
        success: false,
        message: error.message || `API Error: ${response.status}`,
      };
    }

    return response.json();
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Network error",
    };
  }
}


export async function getOrders(storeId?: string): Promise<OrdersResponse> {
  try {
    const id = storeId || getStoreId();
    const response = await fetch(`${BASE_URL}/store/${id}/order`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return {
        success: false,
        message: error.message || `API Error: ${response.status}`,
      };
    }

    return response.json();
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Network error",
    };
  }
}

export async function getOrderById(
  orderId: string,
  storeId?: string
): Promise<CreateOrderResponse> {
  try {
    const id = storeId || getStoreId();
    const response = await fetch(`${BASE_URL}/store/${id}/order/${orderId}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return {
        success: false,
        message: error.message || `API Error: ${response.status}`,
      };
    }

    return response.json();
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Network error",
    };
  }
}
