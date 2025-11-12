import axios, { InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3800/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add interceptors for tokens, logging, etc.
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Example: attach auth token (if available)
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

export default api;
