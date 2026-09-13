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
          <Link href="/" className="font-bold text-xl sm:text-2xl rounded transition-transform duration-200 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
            Electro<span className="text-orange-600">Zone</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex gap-4 xl:gap-6">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="relative py-2 text-gray-600 transition-colors duration-200 hover:text-orange-600 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-orange-600 after:transition-[width] after:duration-200 hover:after:w-full focus-visible:outline-none focus-visible:text-orange-600"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-3">

            {/* Cart */}
            <Link href="/cart" aria-label="Shopping cart" className="relative rounded-full p-2 transition-all duration-200 hover:bg-orange-50 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
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
                className="hidden sm:block px-3 py-1 text-red-600 border rounded text-sm transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
              >
                Logout
              </button>
            ) : (
              <Link href="/login" className="hidden sm:block px-3 py-1 border border-orange-200 rounded text-sm text-orange-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-600 hover:bg-orange-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
                Login
              </Link>
            )}

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              className="lg:hidden rounded p-1 text-2xl transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden flex flex-col gap-2 py-4 border-t page-enter">

            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded px-2 py-1.5 text-gray-600 transition-colors hover:bg-orange-50 hover:text-orange-600"
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
