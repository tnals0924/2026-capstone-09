import { Api } from './Api';
import { authStorage } from './authStorage';
import { customFetch, createAuthFetch } from './interceptors';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const publicApi = new Api({
  baseUrl: baseURL,
  customFetch: customFetch(),
});

export const privateApi = new Api<string>({
  baseUrl: baseURL,
  securityWorker: (token) => (token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
  customFetch: createAuthFetch(),
});

privateApi.setSecurityData(authStorage.getAccess());
