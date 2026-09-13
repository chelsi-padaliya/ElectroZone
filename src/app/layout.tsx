import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";

export const metadata: Metadata = {
  title: "QuickCart - Your Perfect Shopping Experience",
  description: "Experience pure sound, next-level gaming, and premium tech. Shop headphones, PlayStation 5, MacBook Pro & more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50 text-slate-900">
        <CartProvider><WishlistProvider>{children}</WishlistProvider></CartProvider>
      </body>
    </html>
  );
}
