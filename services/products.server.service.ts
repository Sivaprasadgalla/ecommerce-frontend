// lib/productServerService.ts

import apiServer from "@/lib/apiServer";
import { Product, ProductResponse, ProductsResponse } from "./products.service";

export async function ssrGetProducts(): Promise<Product[]> {
  const res = await apiServer.get<ProductsResponse>("/products");
  return res.data.products;
}

export async function ssrGetProductById(id: string): Promise<Product> {
  const res = await apiServer.get<ProductResponse>(`/products/${id}`);
  console.log(res.data);
  return res.data.product;
}
