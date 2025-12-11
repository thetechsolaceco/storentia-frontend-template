export {
  authAPI,
  setUserSession,
  getUserSession,
  clearUserSession,
  isAuthenticated,
  getAuthToken,
  setApiKey,
  getApiKey,
  setStoreData,
  getStoreData,
  setAuthSession,
  getAuthSession,
  clearAuthSession,
  type User,
  type StoreData,
  type Store,
  type StoreOwner,
  type ValidationResponse,
} from "./auth";

export { fetchWithCredentials, fetchWithApiKey, BASE_URL } from "./shared";

export { API_ENDPOINTS } from "./api";
