"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
};

type Props = {
  products: Product[];
  onAddToCart?: (product: Product) => void; // optional handler
};

const WISHLIST_KEY = "wishlist_v1";

export default function ProductGrid({ products, onAddToCart }: Props) {
  const [wishlist, setWishlist] = useState<Record<string, true>>(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(WISHLIST_KEY) : null;
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = true;
      return next;
    });
  };

  return (
    <ul className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <li
          key={p._id}
          className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-shadow"
        >
          {/* Image + overlay */}
          <div className="relative h-56 sm:h-64 bg-gray-50">
            <Image
              src={p.image}
              alt={p.name}
              height={100}
              width={100}
              quality={100}
              unoptimized
              loading="lazy"
              className="w-full h-full object-cover transform transition-transform duration-500 ease-out group-hover:scale-105"
              onError={(e) => ((e.target as HTMLImageElement).src = "/images/placeholder.png")}
            />

            {/* faded gradient overlay on hover */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* action buttons - appear on hover */}
            <div className="absolute inset-x-4 bottom-4 flex items-center justify-between opacity-0 translate-y-3 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <div className="flex gap-2">
                <Link href={`/products/${p._id}`}>
                  <span
                    className="inline-flex items-center text-black gap-2 rounded-full bg-white/90 backdrop-blur-sm px-3 py-2 text-sm font-medium shadow-sm hover:bg-white"
                    aria-label={`View ${p.name}`}
                  >
                    {/* view icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View
                  </span>
                </Link>

                <button
                  onClick={() => onAddToCart ? onAddToCart(p) : alert(`Add ${p.name} to cart (example)`)}
                  disabled={p.stock <= 0}
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium shadow-sm ${
                    p.stock > 0 ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-white/90 text-gray-400 cursor-not-allowed"
                  }`}
                  aria-label={`Add ${p.name} to cart`}
                >
                  {/* cart icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 21a1 1 0 11-2 0 1 1 0 012 0zM8 21a1 1 0 11-2 0 1 1 0 012 0z" />
                  </svg>
                  Add
                </button>
              </div>

              <button
                onClick={() => toggleWishlist(p._id)}
                aria-pressed={!!wishlist[p._id]}
                aria-label={wishlist[p._id] ? `Remove ${p.name} from wishlist` : `Add ${p.name} to wishlist`}
                className="rounded-full bg-white/90 backdrop-blur-sm p-2 shadow-sm hover:bg-white"
                title={wishlist[p._id] ? "Remove from wishlist" : "Add to wishlist"}
              >
                {wishlist[p._id] ? (
                  // filled heart
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21s-7.447-4.883-10.243-8.04C-1.024 8.153 3.72 3 8.5 6.5 10.205 7.94 12 9.5 12 9.5s1.795-1.56 3.5-2.99C20.28 3 25.024 8.153 22.243 12.96 19.447 16.117 12 21 12 21z" />
                  </svg>
                ) : (
                  // outline heart
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 10-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Content area */}
          <Link href={`/products/${p._id}`} className="block p-4">
            <h3 className="text-base font-semibold text-gray-900 truncate">{p.name}</h3>
            <p className="mt-1 text-sm text-gray-600 line-clamp-2" style={{ WebkitLineClamp: 2 }}>
              {p.description}
            </p>

            <div className="mt-4 flex items-center justify-between">
              <div>
                <div className="text-lg font-bold text-gray-900">₹{p.price.toFixed(2)}</div>
                <div className={`text-xs font-medium mt-0.5 ${p.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                  {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-2">
                {/* small inline wishlist for desktop without hover */}
                <button
                  onClick={() => toggleWishlist(p._id)}
                  aria-pressed={!!wishlist[p._id]}
                  className={`p-2 rounded-full border ${wishlist[p._id] ? "border-rose-300" : "border-gray-200"} hover:scale-105 transform transition-transform`}
                >
                  {wishlist[p._id] ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-rose-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 21s-7.447-4.883-10.243-8.04C-1.024 8.153 3.72 3 8.5 6.5 10.205 7.94 12 9.5 12 9.5s1.795-1.56 3.5-2.99C20.28 3 25.024 8.153 22.243 12.96 19.447 16.117 12 21 12 21z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 10-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
