"use client";

import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/Skeleton";
import type { Product } from "@/types/product";

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  });
type Sort = "latest" | "price-low" | "price-high";
const priceOf = (product: Product) => product.offerPrice ?? product.price;

function useDebouncedValue<T>(value: T, delay = 250) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function AllProducts() {
  const {
    data: products = [],
    isLoading,
    error,
  } = useSWR<Product[]>("/api/products", fetcher, { revalidateOnFocus: false });
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [onSale, setOnSale] = useState(false);
  const [sort, setSort] = useState<Sort>("latest");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const debouncedQuery = useDebouncedValue(query.trim().toLowerCase());
  const categories = useMemo(
    () =>
      [
        ...new Set(products.map((product) => product.category).filter(Boolean)),
      ].sort(),
    [products],
  );
  const filteredProducts = useMemo(
    () =>
      products
        .filter((product) => {
          const productPrice = priceOf(product);
          const matchesText =
            !debouncedQuery ||
            `${product.name} ${product.description ?? ""} ${product.category}`
              .toLowerCase()
              .includes(debouncedQuery);
          return (
            matchesText &&
            (!category || product.category === category) &&
            (!minPrice || productPrice >= Number(minPrice)) &&
            (!maxPrice || productPrice <= Number(maxPrice)) &&
            (!onSale ||
              Boolean(product.offerPrice && product.offerPrice < product.price))
          );
        })
        .sort((a, b) =>
          sort === "price-low"
            ? priceOf(a) - priceOf(b)
            : sort === "price-high"
              ? priceOf(b) - priceOf(a)
              : new Date(b.createdAt ?? 0).getTime() -
                new Date(a.createdAt ?? 0).getTime(),
        ),
    [products, debouncedQuery, category, minPrice, maxPrice, onSale, sort],
  );
  const clearFilters = () => {
    setQuery("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setOnSale(false);
    setSort("latest");
  };
  const activeFilters = [
    category,
    minPrice && `Min ₹${minPrice}`,
    maxPrice && `Max ₹${maxPrice}`,
    onSale && "On sale",
  ].filter((filter): filter is string => Boolean(filter));
  const panel = (
    <div className="space-y-6">
      <div>
        <label
          htmlFor="product-search"
          className="mb-2 block text-sm font-semibold text-slate-800"
        >
          Search products
        </label>
        <input
          id="product-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name…"
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
        />
      </div>
      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-slate-800">
          Category
        </legend>
        <div className="space-y-2">
          {categories.map((item) => (
            <label
              key={item}
              className="flex cursor-pointer items-center gap-2 text-sm text-slate-600"
            >
              <input
                type="radio"
                name="category"
                checked={category === item}
                onChange={() => setCategory(item)}
                className="accent-orange-600"
              />
              {item}
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-slate-800">
          Price range
        </legend>
        <div className="grid grid-cols-2 gap-2">
          <input
            aria-label="Minimum price"
            inputMode="numeric"
            min="0"
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-500"
          />
          <input
            aria-label="Maximum price"
            inputMode="numeric"
            min="0"
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-500"
          />
        </div>
      </fieldset>
      {/* <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
        <input
          type="checkbox"
          checked={onSale}
          onChange={(e) => setOnSale(e.target.checked)}
          className="h-4 w-4 accent-orange-600"
        />
        On sale
      </label> */}
      <button
        onClick={clearFilters}
        className="text-sm font-medium text-orange-700 underline-offset-4 transition hover:text-orange-900 hover:underline"
      >
        Clear all filters
      </button>
    </div>
  );
  return (
    <>
      <Header />
      <main className="page-enter min-h-screen px-4 pb-14 sm:px-6 md:px-10 lg:px-16 xl:px-32">
        <div className="pt-8 sm:pt-10">
          <p className="text-xl font-medium sm:text-2xl">All products</p>
          <div className="h-0.5 w-16 rounded-full bg-orange-600" />
        </div>
        <div className="mt-7 flex gap-8">
          <aside className="hidden h-fit max-h-[calc(100vh-6rem)] w-60 shrink-0 overflow-y-auto rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-20 lg:block">
            {panel}
          </aside>
          <section className="min-w-0 flex-1">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-600">
                {isLoading
                  ? "Loading products…"
                  : `${filteredProducts.length} of ${products.length} products`}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium transition hover:border-orange-300 hover:text-orange-700 lg:hidden"
                >
                  Filters
                </button>
                <label className="sr-only" htmlFor="sort-products">
                  Sort products
                </label>
                <select
                  id="sort-products"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as Sort)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-orange-500"
                >
                  <option value="latest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
            {activeFilters.length > 0 && (
              <div className="mb-5 flex flex-wrap gap-2">
                {activeFilters.map((filter) => (
                  <span
                    key={filter}
                    className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-800"
                  >
                    {filter}
                  </span>
                ))}
              </div>
            )}
            {isLoading ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              <div className="rounded-xl border border-red-100 bg-red-50 p-8 text-center text-red-700">
                We couldn’t load products. Please refresh and try again.
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
                <p className="font-medium text-slate-800">
                  No products match these filters.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-3 text-sm font-medium text-orange-700 hover:underline"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 xl:grid-cols-4">
                {filteredProducts.map((product) => (
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
          </section>
        </div>
      </main>
      {mobileFiltersOpen && (
        <div
          className="fixed inset-0 z-[60] bg-slate-950/35 lg:hidden"
          onClick={() => setMobileFiltersOpen(false)}
        >
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Product filters"
            onClick={(e) => e.stopPropagation()}
            className="page-enter absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <p className="text-lg font-semibold">Filters</p>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Close filters"
                className="rounded p-1 text-slate-500 hover:bg-slate-100"
              >
                ×
              </button>
            </div>
            {panel}
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-6 w-full rounded-lg bg-orange-600 py-3 text-sm font-semibold text-white transition active:scale-[0.98]"
            >
              Show {filteredProducts.length} products
            </button>
          </aside>
        </div>
      )}
      <Footer />
    </>
  );
}
