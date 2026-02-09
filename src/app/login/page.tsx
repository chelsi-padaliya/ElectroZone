"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { validate } from "@/lib/validation";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!validate.email(email)) return alert("Invalid email format");
    if (!validate.required(password)) return alert("Password is required");

    setLoading(true);

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/cart");
    } else {
      alert(data.message || "Invalid login");
    }
  };

  const handleForgot = async () => {
    if (!validate.email(email)) return alert("Enter a valid email first");

    const res = await fetch("/api/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, type: "reset" }),
    });

    const data = await res.json();

    if (data.success) {
      router.push(`/verify-otp?email=${email}&reset=true`);
    } else {
      alert(data.message || "Failed to send OTP");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-orange-50 to-white px-4">
      <div className="bg-white border border-slate-200 shadow-lg p-8 rounded-lg w-full max-w-md">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Welcome to <span className="text-orange-600">ElectroZone</span>
        </h2>

        <input
          placeholder="Email"
          className="border border-slate-300 w-full p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-orange-600"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border border-slate-300 w-full p-3 mb-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-600"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <div className="text-right mb-4">
          <button
            onClick={handleForgot}
            className="text-sm text-orange-600 hover:underline font-medium"
          >
            Forgot password?
          </button>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="bg-orange-600 hover:bg-orange-700 text-white w-full py-3 rounded font-medium transition disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm mt-4 text-center text-gray-600">
          New User?{" "}
          <Link href="/register" className="text-orange-600 hover:underline font-medium">
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}
