"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getProductById, updateProduct } from "@/services/products.service";

export default function EditProductPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const router = useRouter();

  const [form, setForm] = useState({ name: "", description: "", price: 0, image: "", stock: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      try {
        const productData = await getProductById(id);
        setForm({ name: productData.name || "", description: productData.description || "", price: productData.price || 0, image: productData.image || "", stock: productData.stock || 0 });
        setImagePreview(productData.image || null);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const { name, value } = target;
    setForm((f) => ({ ...f, [name]: name === "price" || name === "stock" ? Number(value) : value }));
  };

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert to base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setImagePreview(base64);
      setForm((f) => ({ ...f, image: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return setError("Missing product id");
    setSaving(true);
    setError(null);
    try {
      await updateProduct(id, form);
      router.push("/admin/products");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  if (!id) return <p className="text-red-600">No product id provided.</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Edit Product</h2>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4 max-w-xl text-gray-800">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input name="name" value={form.name} onChange={onChange} className="mt-1 block w-full border px-3 py-2 rounded" required />
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea 
              name="description" 
              value={form.description} 
              onChange={(e) => {
                const target = e.target as HTMLTextAreaElement;
                onChange({ target } as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>);
              }}
              className="mt-1 block w-full border px-3 py-2 rounded" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Price</label>
              <input name="price" type="number" step="0.01" value={form.price} onChange={onChange} className="mt-1 block w-full border px-3 py-2 rounded" required />
            </div>
            <div>
              <label className="block text-sm font-medium">Stock</label>
              <input name="stock" type="number" value={form.stock} onChange={onChange} className="mt-1 block w-full border px-3 py-2 rounded" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Image</label>
            <input 
              type="file" 
              name="image" 
              onChange={onImageChange}
              accept="image/*"
              className="mt-1 block w-full border px-3 py-2 rounded" 
            />
            {imagePreview && (
              <div className="mt-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} alt="Preview" className="h-32 w-32 object-cover rounded" />
              </div>
            )}
          </div>

          {error && <p className="text-red-600">{error}</p>}

          <div>
            <button type="submit" disabled={saving} className="bg-indigo-600 text-white px-4 py-2 rounded">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
