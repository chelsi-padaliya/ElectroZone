"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/types/product";

interface WishlistContextType {
  items: Product[];
  wishlistIds: Set<string>;
  isLoading: boolean;
  error: string | null;
  isUpdating: (productId: string) => boolean;
  toggleWishlist: (product: Product) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user") ?? "null") as { _id?: string } | null;
  } catch {
    return null;
  }
}

function handleExpiredSession() {
  localStorage.removeItem("user");
  window.dispatchEvent(new Event("auth-change"));
  window.location.assign("/login");
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());

  const loadWishlist = useCallback(async () => {
    if (!getStoredUser()?._id) {
      setItems([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/wishlist");
      const data = await response.json();
      if (response.status === 401) {
        handleExpiredSession();
        return;
      }
      if (!response.ok) throw new Error(data.message || "Failed to fetch wishlist");
      setItems(data.products ?? []);
      setError(null);
    } catch (err) {
      setItems([]);
      setError(err instanceof Error ? err.message : "Failed to fetch wishlist");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadWishlist();
    window.addEventListener("auth-change", loadWishlist);
    return () => window.removeEventListener("auth-change", loadWishlist);
  }, [loadWishlist]);

  const wishlistIds = useMemo(() => new Set(items.map((item) => item._id)), [items]);

  const toggleWishlist = useCallback(async (product: Product) => {
    if (!getStoredUser()?._id) {
      window.location.assign("/login");
      return;
    }
    if (updatingIds.has(product._id)) return;

    const alreadySaved = wishlistIds.has(product._id);
    setUpdatingIds((previous) => new Set(previous).add(product._id));
    setError(null);

    try {
      const response = await fetch("/api/wishlist", {
        method: alreadySaved ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id }),
      });
      const data = await response.json();
      if (response.status === 401) {
        handleExpiredSession();
        return;
      }
      if (!response.ok) throw new Error(data.message || "Unable to update wishlist");

      setItems((previous) =>
        alreadySaved
          ? previous.filter((item) => item._id !== product._id)
          : previous.some((item) => item._id === product._id)
            ? previous
            : [...previous, product],
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update wishlist");
    } finally {
      setUpdatingIds((previous) => {
        const next = new Set(previous);
        next.delete(product._id);
        return next;
      });
    }
  }, [updatingIds, wishlistIds]);

  const isUpdating = useCallback((productId: string) => updatingIds.has(productId), [updatingIds]);

  return (
    <WishlistContext.Provider value={{ items, wishlistIds, isLoading, error, isUpdating, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
}
