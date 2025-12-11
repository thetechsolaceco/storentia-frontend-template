import { fetchWithCredentials } from "../shared";
import { API_ENDPOINTS } from "../api";

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  sku?: string;
  inventory: number;
  images: string[];
  collectionId?: string;
  categoryId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductParams {
  limit?: number;
  offset?: number;
  search?: string;
  collectionId?: string;
  categoryId?: string;
}

export const productsAPI = {
  async getAll(params?: ProductParams): Promise<Product[]> {
    const query = new URLSearchParams();
    if (params?.limit) query.append("limit", String(params.limit));
    if (params?.offset) query.append("offset", String(params.offset));
    if (params?.search) query.append("search", params.search);
    if (params?.collectionId) query.append("collectionId", params.collectionId);
    if (params?.categoryId) query.append("categoryId", params.categoryId);
    const queryStr = query.toString();
    return fetchWithCredentials(`${API_ENDPOINTS.PRODUCTS_GET_ALL}${queryStr ? `?${queryStr}` : ""}`);
  },

  async getById(id: string): Promise<Product> {
    return fetchWithCredentials(`${API_ENDPOINTS.PRODUCTS_GET_BY_ID}/${id}`);
  },

  async create(data: Partial<Product>): Promise<Product> {
    return fetchWithCredentials(API_ENDPOINTS.PRODUCTS_CREATE, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: Partial<Product>): Promise<Product> {
    return fetchWithCredentials(`${API_ENDPOINTS.PRODUCTS_UPDATE}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async delete(id: string): Promise<void> {
    return fetchWithCredentials(`${API_ENDPOINTS.PRODUCTS_DELETE}/${id}`, {
      method: "DELETE",
    });
  },
};
