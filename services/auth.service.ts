// src/services/auth.service.ts

import api from "@/lib/api";

export type SignupData = {
  username: string;
  email: string;
  password: string;
};

export type LoginData = {
  email: string;
  password: string;
};

export type AuthResponse = {
  accessToken: string;
  user: { id: string; username: string; email: string, role: string };
};

export const signup = async (data: SignupData): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>("/users/register", data);
  if (res.status !== 200) {
    throw new Error("Signup failed");
  }
  if (typeof window !== "undefined") {
    localStorage.setItem("token", res.data.accessToken);
  }
  return res.data;
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>("/users/login", data);
  if (res.status !== 200) {
    throw new Error("Login failed");
    }
  if (typeof window !== "undefined") {
    localStorage.setItem("token", res.data.accessToken);
  }
  return res.data;
};
