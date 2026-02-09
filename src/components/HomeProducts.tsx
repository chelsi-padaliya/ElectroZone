"use client";

import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { useRouter } from "next/navigation";
import { ProductCardSkeleton } from "./Skeleton";

const HomeProducts = () => {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const uniqueCategories = new Map();
          data.forEach(product => {
            if (!uniqueCategories.has(product.category)) {
              uniqueCategories.set(product.category, product);
            }
          });
          setProducts(Array.from(uniqueCategories.values()));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col items-center pt-10 sm:pt-12 md:pt-14 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
      <p className="text-xl sm:text-2xl font-medium text-left w-full">Popular products</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-4 sm:gap-5 md:gap-6 mt-6 pb-10 sm:pb-12 md:pb-14 w-full">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <ProductCardSkeleton key={i} />)
        ) : (
          products.map((product) => (
            <ProductCard 
              key={product._id} 
              productId={product._id}
              title={product.name}
              description={product.description}
              image={product.image}
              price={product.price}
              offerPrice={product.offerPrice}
            />
          ))
        )}
      </div>
      <button onClick={() => { router.push('/all-products') }} className="px-8 sm:px-10 md:px-12 py-2 sm:py-2.5 border rounded text-sm sm:text-base text-gray-500/70 hover:bg-slate-50/90 transition">
        See more
      </button>
    </div>
  );
};

export default HomeProducts;
