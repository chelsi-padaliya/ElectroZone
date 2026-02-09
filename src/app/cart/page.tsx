"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import Header from "@/components/Header";
import { assets } from "@/assets/assets";

export default function CartPage() {

  const { items, removeItem, updateQuantity, cartCount } = useCart();
  const router = useRouter();
  const [checkingOut, setCheckingOut] = useState(false);

  const getItemPrice = (item: { price: number; offerPrice?: number }) =>
    item.offerPrice && item.offerPrice > 0 ? item.offerPrice : item.price;

  const subtotal = items.reduce(
    (sum, item) => sum + getItemPrice(item) * item.quantity,
    0
  );

  if (cartCount === 0 && !checkingOut) {
    return (
      <>
        <Header />
        <div className="min-h-[50vh] sm:min-h-[60vh] flex flex-col items-center justify-center px-4">
          <p className="text-xl sm:text-2xl text-gray-500 text-center">
            Your <span className="text-orange-600 font-medium">Cart</span> is empty
          </p>
          <Link
            href="/"
            className="mt-4 text-orange-600 hover:underline"
          >
            Continue Shopping →
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 md:gap-10 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-32 pt-8 sm:pt-10 md:pt-14 mb-12 sm:mb-16 md:mb-20">

        {/* Cart table */}
        <div className="flex-1">

          <div className="flex items-center justify-between mb-6 sm:mb-8 border-b border-gray-500/30 pb-4 sm:pb-6">
            <p className="text-xl sm:text-2xl md:text-3xl text-gray-500">
              Your <span className="font-medium text-orange-600">Cart</span>
            </p>
            <p className="text-base sm:text-lg text-gray-500/80">{cartCount} Items</p>
          </div>

          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <table className="min-w-full table-auto">
              <thead className="text-left">
                <tr>
                  <th className="pb-4 sm:pb-6 px-2 text-gray-600 font-medium text-sm sm:text-base">Product Details</th>
                  <th className="pb-4 sm:pb-6 px-2 text-gray-600 font-medium text-sm sm:text-base">Price</th>
                  <th className="pb-4 sm:pb-6 px-2 text-gray-600 font-medium text-sm sm:text-base">Quantity</th>
                  <th className="pb-4 sm:pb-6 px-2 text-gray-600 font-medium text-sm sm:text-base">Subtotal</th>
                </tr>
              </thead>

              <tbody>
                {items.map(item => (
                  <tr key={item.productId}>

                    {/* Product */}
                    <td className="flex items-center gap-2 sm:gap-4 py-3 sm:py-4 px-2">
                      <div className="rounded-lg bg-gray-500/10 p-1 sm:p-2">
                        <Image
                          src={item.image || '/placeholder.png'}
                          alt={item.name}
                          width={60}
                          height={60}
                          className="sm:w-20 sm:h-20 object-cover mix-blend-multiply"
                        />
                      </div>
                      <div className="text-xs sm:text-sm">
                        <p className="text-gray-800 line-clamp-2">{item.name}</p>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="text-xs text-orange-600 mt-1"
                        >
                          Remove
                        </button>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3 sm:py-4 px-2 text-gray-600 text-sm sm:text-base">
                      ₹{getItemPrice(item)}
                    </td>

                    {/* Quantity */}
                    <td className="py-3 sm:py-4 px-2">
                      <div className="flex items-center gap-0.5 sm:gap-1">

                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                        >
                          <Image
                            src={assets.decrease_arrow}
                            alt="minus"
                            className="w-4 h-4"
                          />
                        </button>

                        <input
                          type="number"
                          value={item.quantity}
                          onChange={e =>
                            updateQuantity(item.productId, Math.max(1, Number(e.target.value)))
                          }
                          className="w-8 sm:w-10 border text-center appearance-none text-sm sm:text-base"
                        />

                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                        >
                          <Image
                            src={assets.increase_arrow}
                            alt="plus"
                            className="w-4 h-4"
                          />
                        </button>
                      </div>
                    </td>

                    {/* Subtotal */}
                    <td className="py-3 sm:py-4 px-2 text-gray-600 text-sm sm:text-base">
                      ₹{(getItemPrice(item) * item.quantity).toFixed(2)}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={() => router.push("/")}
            className="flex items-center mt-4 sm:mt-6 gap-2 text-sm sm:text-base text-orange-600 hover:translate-x-1 transition"
          >
            Continue Shopping →
          </button>
        </div>

        {/* Summary box */}
        <div className="w-full lg:w-80 bg-white border rounded-lg p-4 sm:p-6 h-fit">

          <p className="text-lg sm:text-xl font-medium mb-3 sm:mb-4 text-gray-700">Order Summary</p>

          <div className="flex justify-between text-gray-600 mb-2 text-sm sm:text-base">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
            <span>Shipping</span>
            <span>Free</span>
          </div>

          <hr className="mb-4" />

          <div className="flex justify-between text-base sm:text-lg font-medium mb-4 sm:mb-6">
            <span>Total</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>

          <button
            onClick={() => router.push("/checkout")}
            className="w-full py-2.5 sm:py-3 bg-orange-500 text-white hover:bg-orange-600 transition rounded text-sm sm:text-base"
          >
            Checkout
          </button>

        </div>

      </div>
    </>
  );
}
