import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export const publicApi = axios.create({
  baseURL: API_BASE,
  withCredentials: false,
});

export const authApi = axios.create({
  baseURL: "http://127.0.0.1:8000",
  withCredentials: true,
});
authApi.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
authApi.defaults.headers.common['Accept'] = 'application/json';
authApi.defaults.xsrfCookieName = 'XSRF-TOKEN';
authApi.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';

console.log('[API_BASE]', API_BASE);
