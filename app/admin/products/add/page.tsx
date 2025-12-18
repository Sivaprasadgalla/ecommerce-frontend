"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct } from "@/services/products.service";

export default function AddProductPage() {
  const [form, setForm] = useState({ name: "", description: "", price: 0, image: "", stock: 0 });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useRouter();

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const { name, value } = target;
    setForm((f) => ({ ...f, [name]: name === "price" || name === "stock" ? Number(value) : value }));
  };

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.value;
    if (!file) return;

    setImagePreview(file);
    setForm((f) => ({ ...f, image: file }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await createProduct(form);
      router.push("/admin/products");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "Failed to create product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-black">Add Product</h2>
      <form onSubmit={onSubmit} className="space-y-4 max-w-xl text-black">
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
            type="text" 
            name="image" 
            onChange={onImageChange}
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
            {saving ? "Saving..." : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
