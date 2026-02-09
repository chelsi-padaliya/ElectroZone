"use client";

import Link from "next/link";
import { useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import type { Product } from "@/types/product";
import type { Order } from "@/types/order";
import { validate } from "@/lib/validation";

const CATEGORIES = ["Smartphone", "Laptop", "Watch", "Accessories", "Camera", "Headphone"];
// const CATEGORIES = ["Earphone", "Headphone", "Watch", "Smartphone", "Laptop", "Camera", "Accessories"];
const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  return data.orders ?? data;
};


type Tab = "add" | "products" | "orders";

export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("add");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutate } = useSWRConfig();
  const { data: products = [], mutate: mutateProducts } = useSWR<Product[]>("/api/products", fetcher, {
    refreshInterval: 3000,
    revalidateOnFocus: true,
  });
  const { data: orders = [] } = useSWR<Order[]>("/api/orders", fetcher, {
    refreshInterval: 3000,
    revalidateOnFocus: true,
  });
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    offerPrice: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };



  const startEdit = (p: Product) => {
    setEditingId(p._id);
    setForm({
      name: p.name,
      description: p.description || "",
      category: p.category,
      price: String(p.price),
      offerPrice: p.offerPrice != null ? String(p.offerPrice) : "",
    });
    setImagePreview(p.image || null);
    setActiveTab("add");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name: "", description: "", category: "", price: "", offerPrice: "" });
    setImagePreview(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      await mutate("/api/products");
    } catch (err) {
      console.error(err);
      mutateProducts();
      alert("Failed to delete product.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate.required(form.name)) return alert("Product name is required");
    if (!validate.required(form.category)) return alert("Category is required");
    if (!validate.number(form.price) || Number(form.price) <= 0) return alert("Valid price is required");
    if (form.offerPrice && !validate.number(form.offerPrice)) return alert("Offer price must be a valid number");

    setIsSubmitting(true);
    try {
      const payload = { ...form, image: imagePreview || undefined };
      if (editingId) {
        const res = await fetch(`/api/products/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to update product");
        cancelEdit();
      } else {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to add product");
        setForm({ name: "", description: "", category: "", price: "", offerPrice: "" });
        setImagePreview(null);
        setActiveTab("products");
      }
      await mutate("/api/products");
    } catch (err) {
      console.error(err);
      alert(editingId ? "Failed to update product." : "Failed to add product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
    {
      id: "add",
      label: "Add Product",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
    {
      id: "products",
      label: "Product List",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      ),
    },
    {
      id: "orders",
      label: "Orders",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar with Logout */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between h-14 px-4 sm:px-6">
          <Link href="/" className="font-display font-bold text-lg text-slate-900">
            Electro<span className="text-[var(--color-brand)]">Zone</span>
            <span className="text-slate-500 font-normal text-sm ml-2">Seller</span>
          </Link>
          <button
            onClick={() => (window.location.href = "/")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-56 lg:w-64 shrink-0 bg-white border-r border-slate-200 min-h-[calc(100vh-3.5rem)]">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left font-medium transition-colors ${
                  activeTab === item.id
                    ? "bg-[var(--color-brand)] text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 lg:p-8">
          {activeTab === "add" && (
            <div className="max-w-2xl">
              <h1 className="font-display text-2xl font-bold text-slate-900 mb-6">
                {editingId ? "Edit Product" : "Add Product"}
              </h1>
              <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                {/* Product Image */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Product Image</label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden bg-slate-50">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="text-sm text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                    />
                  </div>
                </div>

                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Product Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Enter product name"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[var(--color-brand)] focus:border-transparent outline-none"
                    required
                  />
                </div>

                {/* Product Description */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Product Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Enter product description"
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[var(--color-brand)] focus:border-transparent outline-none resize-none"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[var(--color-brand)] focus:border-transparent outline-none bg-white"
                    required
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Product Price & Offer Price */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Product Price</label>
                    <input
                      type="number"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[var(--color-brand)] focus:border-transparent outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Offer Price</label>
                    <input
                      type="number"
                      value={form.offerPrice}
                      onChange={(e) => setForm({ ...form, offerPrice: e.target.value })}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[var(--color-brand)] focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3 rounded-lg bg-[var(--color-brand)] text-white font-semibold hover:bg-[var(--color-brand-light)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (editingId ? "Updating..." : "Adding...") : editingId ? "UPDATE" : "ADD"}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="px-8 py-3 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {activeTab === "products" && (
            <div>
              <h1 className="font-display text-2xl font-bold text-slate-900 mb-6">Product List</h1>
              {products.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                  <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  <p className="text-slate-500">No products yet. Add your first product!</p>
                  <button
                    onClick={() => setActiveTab("add")}
                    className="mt-4 text-[var(--color-brand)] font-semibold hover:underline"
                  >
                    Add Product
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="text-left py-4 px-4 font-semibold text-slate-700">Product</th>
                        <th className="text-left py-4 px-4 font-semibold text-slate-700">Category</th>
                        <th className="text-left py-4 px-4 font-semibold text-slate-700">Price</th>
                        <th className="text-right py-4 px-4 font-semibold text-slate-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr key={p._id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg bg-slate-200 overflow-hidden shrink-0">
                                {p.image ? (
                                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-slate-400 text-xs">No img</span>
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-slate-900">{p.name}</p>
                                {p.description && <p className="text-sm text-slate-500 truncate max-w-[200px]">{p.description}</p>}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-slate-600">{p.category}</td>
                          <td className="py-4 px-4">
                            <span className="font-medium text-slate-900">₹{p.price}</span>
                            {p.offerPrice != null && <span className="text-[var(--color-brand)] ml-1">(₹{p.offerPrice})</span>}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => startEdit(p)}
                                className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                aria-label="Edit"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDelete(p._id)}
                              className="p-2 rounded-lg text-red-500 hover:bg-red-50"
                              aria-label="Delete"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "orders" && (
            <div>
              <h1 className="font-display text-2xl font-bold text-slate-900 mb-6">Orders</h1>
              {orders.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                  <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-slate-500">No orders yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      className="bg-white rounded-xl border border-slate-200 overflow-hidden"
                    >
                      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                        <div>
                          {/* <span className="font-medium text-slate-900">Order </span> */}
                          <span className="ml-3 text-sm text-slate-500">
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB') : ""}
                          </span>
                        </div>
                        {/* <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            order.status === "pending"
                              ? "bg-amber-100 text-amber-800"
                              : order.status === "shipped"
                                ? "bg-blue-100 text-blue-800"
                                : order.status === "delivered"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-slate-100 text-slate-800"
                          }`}
                        >
                          {order.status}
                        </span> */}
                      </div>
                      <div className="p-4">
                        <div className="space-y-2 mb-4">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex justify-between text-sm">
                              <span className="text-slate-700">
                                {item.name} × {item.quantity}
                              </span>
                              <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                        <div className="pt-2 border-t border-slate-200 flex flex-wrap justify-between gap-4">
                          <div className="text-sm">
                            <p className="font-medium text-slate-900">{order.customerName}</p>
                            <p className="text-slate-600">{order.customerEmail}</p>
                            {order.customerPhone && <p className="text-slate-600">{order.customerPhone}</p>}
                            <p className="text-slate-600 mt-1">{order.shippingAddress}</p>
                          </div>
                          <p className="font-semibold text-slate-900">Total: ₹{order.total.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
