"use client";

import useSWR from "swr";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/Skeleton";
import type { Product } from "@/types/product";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AllProducts() {
  const { data: products = [], isLoading } = useSWR<Product[]>(
    "/api/products",
    fetcher,
    {
      refreshInterval: 5000,
      revalidateOnFocus: true,
    }
  );

  return (
    <>
      <Header />

      <div className="flex flex-col items-start px-4 sm:px-6 md:px-10 lg:px-16 xl:px-32">

        {/* Title */}
        <div className="flex flex-col items-end pt-8 sm:pt-10 md:pt-12">
          <p className="text-xl sm:text-2xl font-medium">All products</p>
          <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
        </div>

        {/* Products grid — SAME FEEL AS OLD DESIGN */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 md:gap-6 mt-8 sm:mt-10 md:mt-12 pb-10 sm:pb-12 md:pb-14 w-full">
            {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="w-full text-center py-20 text-gray-500">
            No products available yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 
                          flex-col items-center gap-4 sm:gap-5 md:gap-6 mt-8 sm:mt-10 md:mt-12 pb-10 sm:pb-12 md:pb-14 w-full">

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

      <Footer />
    </>
  );
}
