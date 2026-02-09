"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { assets } from "@/assets/assets";

type ProductCardProps = {
  productId?: string;
  title: string;
  description?: string;
  href?: string;
  image?: string;
  price?: number;
  offerPrice?: number;
};

export default function ProductCard({
  productId,
  title,
  description,
  href,
  image,
  price,
  offerPrice,
}: ProductCardProps) {

  const router = useRouter();
  const { addItem } = useCart();

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();

    const user = localStorage.getItem("user");

    if (user) {
      if (productId && price) {
        addItem({
          productId,
          name: title,
          price,
          offerPrice,
          image
        }, 1);
      }
      router.push("/cart");
    } else {
      router.push("/login");
    }
  };

  const linkHref = productId ? `/product/${productId}` : (href ?? "/shop");

  return (
    <Link
      href={linkHref}
      className="flex flex-col items-start gap-0.5 max-w-[200px] w-full cursor-pointer"
    >

      <div className="group relative bg-gray-500/10 rounded-lg w-full h-52 flex items-center justify-center overflow-hidden">

        {image && (
          <Image
            src={image}
            alt={title}
            width={800}
            height={800}
            className="object-cover w-4/5 h-4/5 md:w-full md:h-full group-hover:scale-105 transition"
          />
        )}

        <button className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md">
          <Image
            src={assets.heart_icon}
            alt="wishlist"
            className="h-3 w-3"
          />
        </button>
      </div>

      <p className="md:text-base font-medium pt-2 w-full truncate">
        {title}
      </p>

      {description && (
        <p className="w-full text-xs text-gray-500/70 max-sm:hidden truncate">
          {description}
        </p>
      )}

      {/* <div className="flex items-center gap-2">
        <p className="text-xs">4.5</p>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Image
              key={i}
              src={i < 4 ? assets.star_icon : assets.star_dull_icon}
              alt="star"
              className="h-3 w-3"
            />
          ))}
        </div>
      </div> */}

      <div className="flex items-end justify-between w-full mt-5">

        <p className="text-base font-medium">
          ₹{offerPrice ?? price}
        </p>

        <button
          onClick={handleBuyNow}
          className="max-sm:hidden px-4 py-1.5 text-gray-500 border border-gray-500/20 rounded-full text-xs hover:bg-slate-50 transition"
        >
          Buy now
        </button>

      </div>
    </Link>
  );
}
