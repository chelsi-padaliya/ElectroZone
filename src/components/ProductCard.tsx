"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { assets } from "@/assets/assets";

type ProductCardProps = { productId?: string; title: string; description?: string; href?: string; image?: string; price?: number; offerPrice?: number };

export default function ProductCard({ productId, title, description, href, image, price, offerPrice }: ProductCardProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    if (localStorage.getItem("user")) {
      if (productId && price) addItem({ productId, name: title, price, offerPrice, image }, 1);
      router.push("/cart");
    } else router.push("/login");
  };
  const sale = Boolean(offerPrice && price && offerPrice < price);
  const discount = sale && price && offerPrice ? Math.round(((price - offerPrice) / price) * 100) : 0;

  return (
    <Link href={productId ? `/product/${productId}` : (href ?? "/shop")} className="group/card flex max-w-[200px] w-full flex-col items-start gap-0.5 rounded-xl cursor-pointer transition-transform duration-200 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
      <div className="group relative flex h-52 w-full items-center justify-center overflow-hidden rounded-xl bg-gray-500/10 shadow-sm transition-shadow duration-200 group-hover/card:shadow-lg">
        {image && <Image src={image} alt={title} width={800} height={800} className="h-4/5 w-4/5 object-cover transition-transform duration-500 ease-out group-hover:scale-110 md:h-full md:w-full" />}
        <button aria-label={`Add ${title} to wishlist`} onClick={(e) => e.preventDefault()} className="absolute top-2 right-2 rounded-full bg-white/95 p-2 shadow-md transition-transform duration-200 hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
          <Image src={assets.heart_icon} alt="" className="h-3 w-3" />
        </button>
      </div>
      <p className="w-full truncate pt-2 font-medium transition-colors duration-200 group-hover/card:text-orange-700 md:text-base">{title}</p>
      {description && <p className="w-full truncate text-xs text-gray-500/70 max-sm:hidden">{description}</p>}
      <div className="mt-5 flex w-full items-end justify-between">
        <div>
          <p className="text-base font-semibold text-slate-900 transition-colors group-hover/card:text-orange-700">₹{offerPrice ?? price}</p>
          {sale && <p className="text-[11px] text-emerald-700">{discount}% off <span className="text-gray-400 line-through">₹{price}</span></p>}
        </div>
        <button onClick={handleBuyNow} className="max-sm:hidden rounded-full border border-gray-500/20 px-4 py-1.5 text-xs text-gray-600 transition-all duration-200 hover:border-orange-600 hover:bg-orange-600 hover:text-white active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">Buy now</button>
      </div>
    </Link>
  );
}
