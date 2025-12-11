import { fetchWithCredentials } from "../shared";
import { API_ENDPOINTS } from "../api";

export interface Discount {
  id: string;
  code: string;
  description?: string;
  type: "percentage" | "fixed";
  value: number;
  minPurchase?: number;
  maxUses?: number;
  usedCount: number;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DiscountParams {
  limit?: number;
  offset?: number;
  search?: string;
  isActive?: boolean;
}

export const discountsAPI = {
  async getAll(params?: DiscountParams): Promise<Discount[]> {
    const query = new URLSearchParams();
    if (params?.limit) query.append("limit", String(params.limit));
    if (params?.offset) query.append("offset", String(params.offset));
    if (params?.search) query.append("search", params.search);
    if (params?.isActive !== undefined) query.append("isActive", String(params.isActive));
    const queryStr = query.toString();
    return fetchWithCredentials(`${API_ENDPOINTS.DISCOUNTS_GET_ALL}${queryStr ? `?${queryStr}` : ""}`);
  },

  async getById(id: string): Promise<Discount> {
    return fetchWithCredentials(`${API_ENDPOINTS.DISCOUNTS_GET_BY_ID}/${id}`);
  },

  async create(data: Partial<Discount>): Promise<Discount> {
    return fetchWithCredentials(API_ENDPOINTS.DISCOUNTS_CREATE, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: Partial<Discount>): Promise<Discount> {
    return fetchWithCredentials(`${API_ENDPOINTS.DISCOUNTS_UPDATE}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async delete(id: string): Promise<void> {
    return fetchWithCredentials(`${API_ENDPOINTS.DISCOUNTS_DELETE}/${id}`, {
      method: "DELETE",
    });
  },
};
