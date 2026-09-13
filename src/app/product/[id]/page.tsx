"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import ProductCard from "@/components/ProductCard";
import { ProductDetailSkeleton } from "@/components/Skeleton";
import type { Product } from "@/types/product";
import { assets } from "@/assets/assets";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function ProductPage() {

  const { id } = useParams();
  const router = useRouter();
  const { data: product, isLoading } = useSWR<Product>(
    id ? `/api/products/${id}` : null,
    fetcher
  );

  const { data: featured = [] } = useSWR<Product[]>("/api/products", fetcher);

  const { addItem } = useCart();
  const { wishlistIds, toggleWishlist, isUpdating } = useWishlist();

  const [mainImage, setMainImage] = useState<string | null>(null);

  if (isLoading || !product) {
    return (
      <>
        <Header />
        <div className="px-6 md:px-16 lg:px-32 pt-14">
          <ProductDetailSkeleton />
        </div>
        <Footer />
      </>
    );
  }

  const displayPrice =
    product.offerPrice && product.offerPrice > 0
      ? product.offerPrice
      : product.price;
  const isWishlisted = wishlistIds.has(product._id);
  const wishlistPending = isUpdating(product._id);

  return (
    <>
    <Header/>
    <div className="bg-white min-h-screen">

      {/* Back */}
      <div className="px-6 md:px-16 lg:px-32 pt-8">
        <Link href="/" className="text-gray-600 hover:text-orange-500">
          ← Back
        </Link>
      </div>

      {/* Main section */}
      <div className="px-6 md:px-16 lg:px-32 pt-14 space-y-10">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

          {/* Images */}
          <div className="px-5 lg:px-16 xl:px-20">
            <div className="rounded-lg overflow-hidden bg-gray-500/10 mb-4">
              <Image
                src={mainImage || product.image || '/placeholder.png'}
                alt={product.name}
                width={1200}
                height={800}
                className="w-full object-cover mix-blend-multiply"
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              {[product.image || '/placeholder.png'].map((img, i) => (
                <div
                  key={i}
                  onClick={() => setMainImage(img)}
                  className="cursor-pointer rounded-lg overflow-hidden bg-gray-500/10"
                >
                  <Image
                    src={img}
                    alt="thumb"
                    width={300}
                    height={200}
                    className="object-cover mix-blend-multiply"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <h1 className="text-3xl font-medium text-gray-800 mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Image
                    key={i}
                    src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                    alt="star"
                    className="h-4 w-4"
                  />
                ))}
              </div>
              <p>(4.5)</p>
            </div>

            <p className="text-gray-600 mt-3">
              {product.description}
            </p>

            <p className="text-3xl font-medium mt-6">
              ₹{displayPrice}
              {product.offerPrice && (
                <span className="text-base line-through text-gray-500 ml-2">
                  {product.price}
                  ₹
                </span>
              )}
            </p>

            <hr className="my-6" />

            {/* Specs */}
            <table className="table-auto w-full max-w-72">
              <tbody>
                <tr>
                  <td className="text-gray-600 font-medium">Brand</td>
                  <td className="text-gray-500">Generic</td>
                </tr>
                <tr>
                  <td className="text-gray-600 font-medium">Color</td>
                  <td className="text-gray-500">Multi</td>
                </tr>
                <tr>
                  <td className="text-gray-600 font-medium">Category</td>
                  <td className="text-gray-500">{product.category}</td>
                </tr>
              </tbody>
            </table>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 mt-10">
              <button
                onClick={() => addItem({
                  productId: product._id,
                  name: product.name,
                  price: product.price,
                  offerPrice: product.offerPrice,
                  image: product.image
                }, 1)}
                className="w-full py-3.5 bg-gray-100 hover:bg-gray-200 transition"
              >
                Add to Cart
              </button>

              <button
                onClick={() => {
                  addItem({
                    productId: product._id,
                    name: product.name,
                    price: product.price,
                    offerPrice: product.offerPrice,
                    image: product.image
                  }, 1);
                  router.push("/cart");
                }}
                className="w-full py-3.5 bg-orange-500 text-white hover:bg-orange-600 transition"
              >
                Buy now
              </button>
              <button
                onClick={() => void toggleWishlist(product)}
                disabled={wishlistPending}
                aria-pressed={isWishlisted}
                className={`inline-flex w-full items-center justify-center gap-2 border py-3.5 transition disabled:cursor-wait disabled:opacity-60 sm:w-auto sm:px-5 ${isWishlisted ? "border-rose-200 bg-rose-50 text-rose-600" : "border-slate-200 text-slate-700 hover:border-orange-300 hover:text-orange-700"}`}
              >
                <svg className="h-5 w-5" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
                </svg>
                {wishlistPending ? "Updating..." : isWishlisted ? "Saved" : "Add to Wishlist"}
              </button>
            </div>

          </div>
        </div>

        {/* Featured */}
        <div className="flex flex-col items-center">
          <div className="text-center mt-16 mb-4">
            <p className="text-3xl font-medium">
              Featured <span className="text-orange-600">Products</span>
            </p>
            <div className="w-28 h-0.5 bg-orange-600 mx-auto mt-2"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14 w-full">
            {featured.slice(0, 5).map(p => (
              <ProductCard
                key={p._id}
                productId={p._id}
                title={p.name}
                description={p.description}
                image={p.image}
                price={p.price}
                offerPrice={p.offerPrice}
              />
            ))}
          </div>

          <button className="px-8 py-2 mb-16 border rounded text-gray-500 hover:bg-gray-50 transition">
            See more
          </button>
        </div>

      </div>
    </div>
    <Footer/>
    </>
  );
}
