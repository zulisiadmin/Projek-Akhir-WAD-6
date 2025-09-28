import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export const publicApi = axios.create({
  baseURL: API_BASE,
  withCredentials: false,
});

export const authApi = axios.create({
  baseURL: API_BASE,        // <— TANPA /api di sini
  withCredentials: true,
});
authApi.defaults.xsrfCookieName = 'XSRF-TOKEN';
authApi.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';

console.log('[API_BASE]', API_BASE);
