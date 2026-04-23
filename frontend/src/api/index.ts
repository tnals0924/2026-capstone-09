import { Api } from './Api';
import { authStorage } from './authStorage';
import { customFetch, createAuthFetch } from './interceptors';

export const publicApi = new Api({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  customFetch: customFetch(),
});

export const privateApi = new Api<string>({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  securityWorker: (token) => (token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
  customFetch: createAuthFetch(),
});

privateApi.setSecurityData(authStorage.getAccess());
