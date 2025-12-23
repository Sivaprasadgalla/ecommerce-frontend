import api from "@/lib/api";

export interface CartProduct {
  product_id: {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    stock: number;
    createdAt: string;
  };
  quantity: number;
}

export interface Cart {
  _id: string;
  user_id: string | null;          // logged-in user
  guestSessionId: string | null;   // guest user
  products: CartProduct[];
  createdAt: string;
  updatedAt: string;
}

// public route
export const getCart = async (guestSessionId: string | null, userId: string | null): Promise<Cart> => {
    const res = await api.post<Cart>("/cart", { guestSessionId, userId });
    if (res.status !== 200) {
      throw new Error("Failed to fetch cart");
    }
    return res.data;
};

// public route
export const addToCart = async (guestSessionId: string | null, product_id: string, quantity: number): Promise<Cart> => {
    const res = await api.post<Cart>("/cart/add", { guestSessionId, product_id, quantity });
    if (res.status !== 200) {
      throw new Error("Failed to add to cart");
    }
    return res.data;
};

// public route
export const updateCartProduct = async (guestSessionId: string | null, product_id: string, quantity: number): Promise<Cart> => {
    const res = await api.put<Cart>("/cart/update", { guestSessionId, product_id, quantity });
    if (res.status !== 200) {
      throw new Error("Failed to update cart product");
    }
    return res.data;
};

// public route
export const removeCartProduct = async (guestSessionId: string | null, product_id: string): Promise<Cart> => {
    const res = await api.delete<Cart>("/cart/remove", { data: { guestSessionId, product_id } });
    if (res.status !== 200) {
      throw new Error("Failed to remove cart product");
    }
    return res.data;
};

// public route
export const clearCart = async (guestSessionId: string | null): Promise<void> => {
    const res = await api.delete<void>("/cart/clear", { data: { guestSessionId } });
    if (res.status !== 200) {
      throw new Error("Failed to clear cart");
    }
};