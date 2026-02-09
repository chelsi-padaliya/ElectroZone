"use client";

import useSWR from "swr";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types/product";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ShopPage() {
  const { data: products = [], isLoading } = useSWR<Product[]>("/api/products", fetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: true,
  });

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="font-display text-3xl font-bold text-slate-900 mb-2">Shop</h1>
          <p className="text-slate-600 mb-10">Browse all our products</p>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-2xl bg-slate-200 animate-pulse h-64" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
              <p className="text-slate-500">No products available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  productId={product._id}
                  title={product.name}
                  description={product.description}
                  image={product.image}
                  price={product.price}
                  offerPrice={product.offerPrice}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
