import { fetchWithCredentials } from "../shared";
import { API_ENDPOINTS } from "../api";

export interface Billing {
  id: string;
  orderId: string;
  userId: string;
  amount: number;
  currency: string;
  status: "pending" | "paid" | "failed" | "refunded";
  paymentMethod?: string;
  transactionId?: string;
  invoiceUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BillingParams {
  limit?: number;
  offset?: number;
  status?: string;
  userId?: string;
}

export const billingsAPI = {
  async getAll(params?: BillingParams): Promise<Billing[]> {
    const query = new URLSearchParams();
    if (params?.limit) query.append("limit", String(params.limit));
    if (params?.offset) query.append("offset", String(params.offset));
    if (params?.status) query.append("status", params.status);
    if (params?.userId) query.append("userId", params.userId);
    const queryStr = query.toString();
    return fetchWithCredentials(`${API_ENDPOINTS.BILLINGS_GET_ALL}${queryStr ? `?${queryStr}` : ""}`);
  },

  async getById(id: string): Promise<Billing> {
    return fetchWithCredentials(`${API_ENDPOINTS.BILLINGS_GET_BY_ID}/${id}`);
  },

  async create(data: Partial<Billing>): Promise<Billing> {
    return fetchWithCredentials(API_ENDPOINTS.BILLINGS_CREATE, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: Partial<Billing>): Promise<Billing> {
    return fetchWithCredentials(`${API_ENDPOINTS.BILLINGS_UPDATE}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
};
