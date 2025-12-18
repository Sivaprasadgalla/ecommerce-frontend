"use client";

import { Product } from "@/services/products.service";
import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  product: Product;
  onAddToCart?: (payload: { productId: string; qty: number }) => void;
};

const WISHLIST_KEY = "wishlist_v1";

export default function ProductDetailClient({ product, onAddToCart }: Props) {
  const [qty, setQty] = useState<number>(1);
  const [wishlist, setWishlist] = useState<Record<string, true>>(() => {
    try {
      const raw =
        typeof window !== "undefined"
          ? localStorage.getItem(WISHLIST_KEY)
          : null;
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });
//   const [activeImg, setActiveImg] = useState<string>(
//     product.image
//   );

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  const toggleWishlist = () => {
    setWishlist((prev) => {
      const next = { ...prev };
      if (next[product._id]) delete next[product._id];
      else next[product._id] = true;
      return next;
    });
  };

  function inc() {
    setQty((q) => Math.min(q + 1, product.stock || 99));
  }
  function dec() {
    setQty((q) => Math.max(1, q - 1));
  }

  return (
    <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
      {/* Gallery */}
      <div className="space-y-4">
        <div className="w-full bg-gray-100 rounded-xl overflow-hidden">
          {/* Large image with simple zoom on hover (scale) */}
          <div className="relative h-96 overflow-hidden">
            <Image
              height={100}
              width={100}
              quality={100}
              unoptimized
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain transform transition-transform duration-500 hover:scale-105"
              onError={(e) =>
                ((e.target as HTMLImageElement).src = "/images/placeholder.png")
              }
              loading="eager"
            />
            <button
              onClick={toggleWishlist}
              aria-pressed={!!wishlist[product._id]}
              className="absolute top-3 right-3 rounded-full bg-white/90 p-2 shadow-sm"
              title={
                wishlist[product._id]
                  ? "Remove from wishlist"
                  : "Add to wishlist"
              }
            >
              {wishlist[product._id] ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-rose-500"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 21s-7.447-4.883-10.243-8.04C-1.024 8.153 3.72 3 8.5 6.5 10.205 7.94 12 9.5 12 9.5s1.795-1.56 3.5-2.99C20.28 3 25.024 8.153 22.243 12.96 19.447 16.117 12 21 12 21z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 10-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Thumbnails */}
        {/* {product.images && product.images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto py-2">
            {product.images.map((img) => (
              <button
                key={img}
                onClick={() => setActiveImg(img)}
                className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border ${
                  activeImg === img ? "border-blue-600" : "border-gray-200"
                }`}
                aria-label="Select image"
              >
                <Image
                  src={img}
                  alt={product.name}
                  width={100}
                  height={100}
                  unoptimized
                  quality={100}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )} */}
        <Image
            src={product.image}
            alt={product.name}
            width={100}
            height={100}
            unoptimized
            quality={100}
            className="w-full h-full object-cover"
            loading="lazy"
        />
      </div>

      {/* Info + actions */}
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold">{product.name}</h1>
          <p className="mt-2 text-sm text-gray-600">{product.description}</p>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <div className="text-2xl font-bold">
              ₹{product.price.toFixed(2)}
            </div>
            <div
              className={`text-sm font-medium ${
                product.stock > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-md border w-max">
              <button
                onClick={dec}
                className="px-3 py-2 text-sm disabled:opacity-50"
                aria-label="Decrease quantity"
                disabled={qty <= 1}
              >
                −
              </button>
              <div className="px-4 py-2 text-sm min-w-[2rem] text-center">
                {qty}
              </div>
              <button
                onClick={inc}
                className="px-3 py-2 text-sm"
                aria-label="Increase quantity"
                disabled={qty >= (product.stock || 99)}
              >
                +
              </button>
            </div>

            <button
              onClick={() =>
                onAddToCart
                  ? onAddToCart({ productId: product._id, qty })
                  : alert(`Add ${qty}x ${product.name} to cart`)
              }
              disabled={product.stock <= 0}
              className={`px-4 py-2 rounded-md text-sm font-medium shadow-sm ${
                product.stock > 0
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              Add to cart
            </button>
          </div>
        </div>

        {/* Extra details */}
        <div className="text-sm text-gray-700">
          <h4 className="font-medium mb-2">Product details</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>Price: ₹{product.price.toFixed(2)}</li>
            <li>
              {product.stock > 0
                ? `${product.stock} items available`
                : "Currently out of stock"}
            </li>
            <li>
              Added:{" "}
              {product.createdAt
                ? new Date(product.createdAt).toLocaleDateString()
                : "—"}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
