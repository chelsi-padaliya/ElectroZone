"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export default function WishlistPage() {
  const { items, isLoading, error, toggleWishlist, isUpdating } = useWishlist();
  const { addItem } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const syncLoginState = () => setIsLoggedIn(Boolean(localStorage.getItem("user")));
    const timer = window.setTimeout(syncLoginState, 0);
    window.addEventListener("auth-change", syncLoginState);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("auth-change", syncLoginState);
    };
  }, []);

  if (!isLoggedIn) {
    return (
      <>
        <Header />
        <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
          <h1 className="text-2xl font-semibold text-slate-800">Sign in to view your wishlist</h1>
          <p className="mt-2 text-slate-600">Save products to revisit them on any device.</p>
          <Link href="/login" className="mt-6 rounded-lg bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700">Login</Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="page-enter min-h-[60vh] px-4 py-8 sm:px-6 md:px-10 lg:px-16 xl:px-32">
        <div className="mb-8 flex items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800 sm:text-3xl">Your Wishlist</h1>
            {!isLoading && !error && <p className="mt-1 text-sm text-slate-500">{items.length} {items.length === 1 ? "item" : "items"} saved</p>}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => <div key={index} className="h-40 animate-pulse rounded-xl bg-slate-200" />)}
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-100 bg-red-50 p-8 text-center text-red-700">
            {error}. Please refresh and try again.
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
            <svg className="mx-auto h-12 w-12 text-rose-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" /></svg>
            <h2 className="mt-4 text-xl font-semibold text-slate-800">Your wishlist is empty</h2>
            <p className="mt-2 text-slate-600">Keep track of the tech you love by saving it here.</p>
            <Link href="/all-products" className="mt-6 inline-block rounded-lg bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700">Continue shopping</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((product) => {
              const sale = Boolean(product.offerPrice && product.offerPrice < product.price);
              const currentPrice = sale ? product.offerPrice : product.price;
              const discount = sale && product.offerPrice ? Math.round(((product.price - product.offerPrice) / product.price) * 100) : 0;
              return (
                <article key={product._id} className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                  <Link href={`/product/${product._id}`} className="shrink-0 rounded-lg bg-slate-100 p-1">
                    <Image src={product.image || "/placeholder.png"} alt={product.name} width={120} height={120} className="h-24 w-24 rounded-md object-cover sm:h-28 sm:w-28" />
                  </Link>
                  <div className="min-w-0 flex flex-1 flex-col">
                    <Link href={`/product/${product._id}`} className="truncate font-semibold text-slate-800 transition hover:text-orange-700">{product.name}</Link>
                    <p className="mt-1 font-semibold text-slate-900">₹{currentPrice}</p>
                    {sale && <p className="text-xs text-emerald-700">{discount}% off <span className="text-slate-400 line-through">₹{product.price}</span></p>}
                    <div className="mt-auto flex flex-wrap gap-2 pt-3">
                      <button onClick={() => addItem({ productId: product._id, name: product.name, price: product.price, offerPrice: product.offerPrice, image: product.image })} className="rounded-md bg-orange-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-orange-700">Add to cart</button>
                      <button onClick={() => void toggleWishlist(product)} disabled={isUpdating(product._id)} className="rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:border-rose-200 hover:bg-rose-50 disabled:cursor-wait disabled:opacity-60">{isUpdating(product._id) ? "Removing..." : "Remove"}</button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
