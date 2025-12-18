"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Product, getProducts, deleteProduct } from "@/services/products.service";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getProducts();
      setProducts(res);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    const ok = window.confirm("Delete this product? This cannot be undone.");
    if (!ok) return;
    try {
      await deleteProduct(id);
      setProducts((p) => p.filter((x) => x._id !== id));
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      alert(msg || "Failed to delete product");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-black">Products</h1>
        <div>
          <Link href="/admin/products/add" className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
            Add Product
          </Link>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading products...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : products.length === 0 ? (
        <p className="text-gray-600">No products found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white text-gray-800 border">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Image</th>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Price</th>
                <th className="px-4 py-2 border">Stock</th>
                <th className="px-4 py-2 border">Created</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">
                    {p.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.image} alt={p.name} className="h-12 w-12 object-cover rounded" />
                    ) : (
                      <div className="h-12 w-12 bg-gray-100 flex items-center justify-center text-sm text-gray-400">No</div>
                    )}
                  </td>
                  <td className="px-4 py-2 border">{p.name}</td>
                  <td className="px-4 py-2 border">${p.price.toFixed(2)}</td>
                  <td className="px-4 py-2 border">{p.stock}</td>
                  <td className="px-4 py-2 border">{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-2 border space-x-2">
                    <Link href={`/admin/products/edit/${p._id}`} className="text-sm bg-yellow-400 text-black px-3 py-1 rounded">Edit</Link>
                    <button onClick={() => handleDelete(p._id)} className="text-sm bg-red-600 text-white px-3 py-1 rounded">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}