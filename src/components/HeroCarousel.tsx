"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const slides = [
  {
    badge: "Limited Time Offer 30% Off",
    title: "Experience Pure Sound - Your Perfect Headphones Awaits!",
    cta: "Buy now",
    cta2: "Find more",
    gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
    bgImage: "linear-gradient(135deg, rgba(251,191,36,0.15) 0%, rgba(249,115,22,0.08) 50%, transparent 100%)",
  },
  {
    badge: "Hurry up only few lefts!",
    title: "Next-Level Gaming Starts Here - Discover PlayStation 5 Today!",
    cta: "Shop Now",
    cta2: "Explore Deals",
    gradient: "from-blue-600/20 via-indigo-500/10 to-transparent",
    bgImage: "linear-gradient(135deg, rgba(37,99,235,0.15) 0%, rgba(99,102,241,0.08) 50%, transparent 100%)",
  },
  {
    badge: "Exclusive Deal 40% Off",
    title: "Power Meets Elegance - Apple MacBook Pro is Here for you!",
    cta: "Order Now",
    cta2: "Learn More",
    gradient: "from-slate-700/20 via-slate-600/10 to-transparent",
    bgImage: "linear-gradient(135deg, rgba(51,65,85,0.15) 0%, rgba(71,85,105,0.08) 50%, transparent 100%)",
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative overflow-hidden bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
            style={{
              background: slide.bgImage,
            }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 flex flex-col justify-center min-h-[320px] lg:min-h-[380px]">
              <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--color-brand)] text-white text-sm font-semibold w-fit mb-6">
                {slide.badge}
              </span>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold max-w-2xl leading-tight">
                {slide.title}
              </h1>
              <div className="flex flex-wrap gap-4 mt-8">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--color-brand)] text-white font-semibold hover:bg-[var(--color-brand-light)] transition-colors"
                >
                  {slide.cta}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-white/40 text-white font-semibold hover:bg-white/10 transition-colors"
                >
                  {slide.cta2}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Dots */}
        <div className="relative z-20 flex gap-2 mt-4">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all ${
                i === current ? "w-8 bg-[var(--color-brand)]" : "w-2 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
