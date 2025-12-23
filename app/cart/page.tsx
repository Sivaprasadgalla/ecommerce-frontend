"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  CartProduct,
  getCart,
  updateCartProduct,
  removeCartProduct,
} from "@/services/cart.service";
import { getGuestSessionId } from "@/utils/guestSession";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartProduct[]>([]);
  const [loading, setLoading] = useState(false);

  const guestSessionId = getGuestSessionId();

  const fetchCart = useCallback( async () => {
    try {
      const cart = await getCart(guestSessionId, null);
      setCartItems(cart.products || []);
    } catch (err) {
      console.error("Failed to fetch cart", err);
    }
  }, [guestSessionId]);

  useEffect(() => {
    if (guestSessionId) fetchCart();
  }, [fetchCart, guestSessionId]);

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return;

    setLoading(true);
    try {
      const response = await updateCartProduct(guestSessionId, productId, quantity);
      console.log("Updated cart", response);
      
      setCartItems(response.products || []);
    } catch (err) {
      console.error("Failed to update cart", err);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId: string) => {
    setLoading(true);
    try {
      const response = await removeCartProduct(guestSessionId, productId);
      setCartItems(response.products || []);
    } catch (err) {
      console.error("Failed to remove item", err);
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.product_id.price,
    0
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">
        Shopping Cart
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          Your cart is empty 🛒
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: CART */}
          <div className="lg:col-span-2">
            {/* HEADER */}
            <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_0.5fr] gap-4 px-4 py-2 text-sm font-semibold text-gray-500 border-b">
              <div>Product</div>
              <div className="text-center">Price</div>
              <div className="text-center">Quantity</div>
              <div className="text-center">Total</div>
              <div className="text-center">Action</div>
            </div>

            {/* ITEMS */}
            <div className="space-y-4 mt-4">
              {cartItems.map((item) => (
                <div
                  key={item.product_id._id}
                  className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_0.5fr] gap-4 items-center p-4 border rounded-lg bg-white shadow-sm"
                >
                  {/* Product */}
                  <div className="flex items-center gap-4">
                    <Image
                      src={item.product_id.image}
                      alt={item.product_id.name}
                      width={120}
                      height={60}
                      className="rounded-md object-cover"
                      unoptimized
                    />
                    <div>
                      <h2 className="font-semibold text-gray-900">
                        {item.product_id.name}
                      </h2>
                      <p className="text-sm text-gray-600 md:hidden">
                        ₹{item.product_id.price}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="hidden md:block text-center text-gray-600">
                    ₹{item.product_id.price}
                  </div>

                  {/* Quantity */}
                  <div className="flex justify-center items-center gap-2 text-gray-800">
                    <button
                      disabled={loading}
                      onClick={() =>
                        updateQuantity(
                          item.product_id._id,
                          item.quantity - 1
                        )
                      }
                      className="w-8 h-8 border rounded hover:bg-gray-100 disabled:opacity-50"
                    >
                      −
                    </button>
                    <span className="w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      disabled={loading}
                      onClick={() =>
                        updateQuantity(
                          item.product_id._id,
                          item.quantity + 1
                        )
                      }
                      className="w-8 h-8 border rounded hover:bg-gray-100 disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>

                  {/* Total */}
                  <div className="text-center font-semibold text-gray-900">
                    ₹{item.quantity * item.product_id.price}
                  </div>

                  {/* Action */}
                  <div className="text-center">
                    <button
                      disabled={loading}
                      onClick={() =>
                        removeItem(item.product_id._id)
                      }
                      className="text-sm text-red-600 hover:text-red-500 hover:underline disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: SUMMARY */}
          <div className="border rounded-lg p-6 bg-gray-50 h-fit sticky top-26">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Order Summary
            </h2>

            <div className="flex justify-between mb-2 text-gray-900">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="flex justify-between mb-4 text-gray-900">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>

            <hr className="mb-4" />

            <div className="flex justify-between text-lg font-bold text-gray-900">
              <span>Total</span>
              <span>₹{subtotal}</span>
            </div>

            <button
              disabled={loading}
              className="mt-6 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-500 disabled:opacity-50"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
