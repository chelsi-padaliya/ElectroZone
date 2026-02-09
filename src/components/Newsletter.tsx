"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      alert(`Thanks for subscribing with ${email}! You'll get 20% off your next order.`);
      setEmail("");
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">
            Subscribe now & get 20% off
          </h2>
          <p className="mt-4 text-slate-600">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          </p>
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[var(--color-brand)] focus:border-transparent outline-none"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-[var(--color-brand)] text-white font-semibold hover:bg-[var(--color-brand-light)] transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
