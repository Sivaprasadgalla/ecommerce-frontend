import api from "@/lib/api";

export type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  createdAt: string;
};

export type ProductsResponse = {
  products: Product[];
};

export type ProductResponse = {
  product: Product;
};

export const getProducts = async (): Promise<Product[]> => {
    const res = await api.get<ProductsResponse>("/products");
    if (res.status !== 200) {
      throw new Error("Failed to fetch products");
    }
    return res.data.products;
};

export const getProductById = async (id: string): Promise<Product> => {
    const res = await api.get<ProductResponse>(`/products/${id}`);
    if (res.status !== 200) {
      throw new Error("Failed to fetch product");
    }
    return res.data.product;
};

export const createProduct = async (data: { name: string; description: string; price: number; image: string; stock: number }): Promise<Product> => {
    const res = await api.post<Product>("/products/add", data);
    console.log(res);
    
    if (res.status !== 201) {
      throw new Error("Failed to create product");
    }
    return res.data;
};

export const updateProduct = async (id: string, data: { name?: string; description?: string; price?: number; image?: string; stock?: number }): Promise<Product> => {
    const res = await api.put<Product>(`/products/update/${id}`, data);
    if (res.status !== 200) {
      throw new Error("Failed to update product");
    }
    return res.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
    const res = await api.delete<void>(`/products/delete/${id}`);
    if (res.status !== 200) {
      throw new Error("Failed to delete product");
    }
};
