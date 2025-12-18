// lib/apiServer.ts
import axios from "axios";

const apiServer = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3800/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: attach server auth token from environment (not from localStorage)
apiServer.interceptors.request.use((config) => {
  const token = process.env.SERVER_API_TOKEN; // optional
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiServer;
