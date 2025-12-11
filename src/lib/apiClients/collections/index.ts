import { fetchWithCredentials } from "../shared";
import { API_ENDPOINTS } from "../api";

export interface Collection {
  id: string;
  name: string;
  description?: string;
  image?: string;
  productCount?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CollectionParams {
  limit?: number;
  offset?: number;
  search?: string;
}

export const collectionsAPI = {
  async getAll(params?: CollectionParams): Promise<Collection[]> {
    const query = new URLSearchParams();
    if (params?.limit) query.append("limit", String(params.limit));
    if (params?.offset) query.append("offset", String(params.offset));
    if (params?.search) query.append("search", params.search);
    const queryStr = query.toString();
    return fetchWithCredentials(`${API_ENDPOINTS.COLLECTIONS_GET_ALL}${queryStr ? `?${queryStr}` : ""}`);
  },

  async getById(id: string): Promise<Collection> {
    return fetchWithCredentials(`${API_ENDPOINTS.COLLECTIONS_GET_BY_ID}/${id}`);
  },

  async create(data: Partial<Collection>): Promise<Collection> {
    return fetchWithCredentials(API_ENDPOINTS.COLLECTIONS_CREATE, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: Partial<Collection>): Promise<Collection> {
    return fetchWithCredentials(`${API_ENDPOINTS.COLLECTIONS_UPDATE}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async delete(id: string): Promise<void> {
    return fetchWithCredentials(`${API_ENDPOINTS.COLLECTIONS_DELETE}/${id}`, {
      method: "DELETE",
    });
  },
};
