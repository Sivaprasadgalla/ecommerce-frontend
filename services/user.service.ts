import api from "@/lib/api";

export type User = {
  _id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
};

export type UsersResponse = {
  users: User[];
};

export const createUser = async (data: { username: string; email: string; password: string; role: string }): Promise<User> => {
    const res = await api.post<User>("/users/new", data);
    if (res.status !== 201) {
      throw new Error("Failed to create user");
    }
    return res.data;
};

export const getUsers = async (): Promise<User[]> => {
    const res = await api.get<UsersResponse>("/users");
    if (res.status !== 200) {
      throw new Error("Failed to fetch users");
    }
    return res.data.users;
};

export const updateUser = async (id: string, data: { username?: string; email?: string; role?: string; password?: string }): Promise<User> => {
    const res = await api.put<User>(`/users/update/${id}`, data);
    if (res.status !== 200) {
      throw new Error("Failed to update user");
    }
    return res.data;
};

export const deleteUser = async (id: string): Promise<void> => {
    const res = await api.delete<void>(`/users/delete/${id}`);
    if (res.status !== 200) {
      throw new Error("Failed to delete user");
    }
};

export const getUserById = async (id: string): Promise<User> => {
    const res = await api.get<User>(`/users/${id}`);
    if (res.status !== 200) {
      throw new Error("Failed to fetch user");
    }
    return res.data;
};

export const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
};

