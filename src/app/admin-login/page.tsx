"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { validate } from "@/lib/validation";

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!validate.email(email)) return alert("Invalid email format");
    if (!validate.required(password)) return alert("Password is required");

    setLoading(true);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.success === true) {
      localStorage.setItem("admin", JSON.stringify(data.admin));
      router.push("/seller");
    } else {
      alert("Invalid admin credentials");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-orange-50 to-white px-4">
      <div className="bg-white border border-slate-200 shadow-lg p-8 rounded-lg w-full max-w-md">

        <h2 className="text-2xl font-bold mb-6 text-center">
          <span className="text-orange-600">Seller</span> Dashboard Login
        </h2>

        <input
          placeholder="Email"
          className="border border-slate-300 w-full p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-orange-600"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border border-slate-300 w-full p-3 mb-6 rounded focus:outline-none focus:ring-2 focus:ring-orange-600"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white w-full py-3 rounded font-medium transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </div>
    </div>
  );
}
