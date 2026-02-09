"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import Header from "@/components/Header";
import { validate } from "@/lib/validation";

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: "",
  });

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user) {
      const parsed = JSON.parse(user);

      setForm((prev) => ({
        ...prev,
        customerName: parsed.name || "",
        customerEmail: parsed.email || "",
        customerPhone: parsed.phone || "",
      }));
    }
  }, []);

  const getItemPrice = (item: { price: number; offerPrice?: number }) =>
    item.offerPrice != null && item.offerPrice > 0 ? item.offerPrice : item.price;

  const total = items.reduce((sum, i) => sum + getItemPrice(i) * i.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    if (!validate.name(form.customerName)) return alert("Name must be at least 2 characters");
    if (!validate.email(form.customerEmail)) return alert("Invalid email format");
    if (form.customerPhone && !validate.phone(form.customerPhone)) return alert("Phone must be 10 digits");
    if (!validate.required(form.shippingAddress)) return alert("Shipping address is required");

    setIsSubmitting(true);

    try {
      const orderItems = items.map((i) => ({
        productId: i.productId,
        name: i.name,
        price: getItemPrice(i),
        quantity: i.quantity,
        image: i.image,
      }));

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: orderItems,
          total,
          customerName: form.customerName,
          customerEmail: form.customerEmail,
          customerPhone: form.customerPhone,
          shippingAddress: form.shippingAddress,
        }),
      });

      if (!res.ok) throw new Error("Failed to place order");

      setOrderPlaced(true);
      clearCart();

    } catch (err) {
      console.error(err);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && !orderPlaced) {
    router.push("/cart");
    return null;
  }

  if (orderPlaced) {
    return (
      <>
        <Header />
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">Order Placed!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for your order. The seller will process it shortly.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 rounded-lg bg-[var(--color-brand)] text-white font-semibold"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-8">Checkout</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            <div className="space-y-4">
              <h2 className="font-semibold">Shipping Details</h2>

              <input
                placeholder="Full Name"
                required
                value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                className="w-full border p-2 rounded"
              />

              <input
                type="email"
                placeholder="Email"
                required
                value={form.customerEmail}
                onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                className="w-full border p-2 rounded"
              />

              <input
                placeholder="Phone Number"
                value={form.customerPhone}
                onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                className="w-full border p-2 rounded"
              />

              <textarea
                required
                rows={3}
                placeholder="Shipping Address"
                value={form.shippingAddress}
                onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })}
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <h2 className="font-semibold mb-4">Order Summary</h2>

              <div className="border p-4 rounded space-y-2">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span>{item.name} × {item.quantity}</span>
                    <span>₹{(getItemPrice(item) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}

                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 py-3 bg-[var(--color-brand)] text-white rounded disabled:opacity-60"
              >
                {isSubmitting ? "Placing Order..." : "Place Order"}
              </button>

            </div>
          </div>
        </form>
      </div>
    </>
  );
}
