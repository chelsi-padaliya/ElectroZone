"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/all-products", label: "All Products" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },

  //  Redirects to admin login instead of dashboard directly
  { href: "/admin-login", label: "Seller Dashboard" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const router = useRouter();

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="font-bold text-xl sm:text-2xl">
            Electro<span className="text-orange-600">Zone</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex gap-4 xl:gap-6">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-orange-600"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-3">

            {/* Cart */}
            <Link href="/cart" className="relative p-2">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs px-1.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User auth */}
            {user ? (
              <button
                onClick={handleLogout}
                className="hidden sm:block px-3 py-1 text-red-600 border rounded text-sm"
              >
                Logout
              </button>
            ) : (
              <Link href="/login" className="hidden sm:block px-3 py-1 border rounded text-sm">
                Login
              </Link>
            )}

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-2xl"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden flex flex-col gap-2 py-4 border-t">

            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-600"
              >
                {link.label}
              </Link>
            ))}

            <Link href="/cart" onClick={() => setMobileMenuOpen(false)}>
              Cart ({cartCount})
            </Link>

            {user ? (
              <button onClick={handleLogout} className="text-red-600 text-left">
                Logout
              </button>
            ) : (
              <Link href="/login">Login</Link>
            )}

          </div>
        )}
      </div>
    </header>
  );
}
