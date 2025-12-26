export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  storeId: process.env.NEXT_PUBLIC_STORENTIA_STOREID,
};

export const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
});

export const getAuthenticatedHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  
  return {
    'Content-Type': 'application/json',
    ...(token && { 'X-Auth-Token': token }),
  };
};