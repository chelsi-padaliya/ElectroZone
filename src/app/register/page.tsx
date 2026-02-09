"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { validate } from "@/lib/validation";

export default function Register() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!validate.name(name)) return alert("Name must be at least 2 characters");
    if (!validate.email(email)) return alert("Invalid email format");
    if (!validate.phone(phone)) return alert("Phone must be 10 digits");
    if (!validate.password(password)) return alert("Password must be at least 6 characters");

    setLoading(true);

    const res = await fetch("/api/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, password }),
    });

    const data = await res.json();

    if (data.success === true) {
      router.push(`/verify-otp?email=${email}`);
    } else {
      alert(data.message || "Failed to send OTP");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-orange-50 to-white px-4">
      <div className="bg-white border border-slate-200 shadow-lg p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Join <span className="text-orange-600">ElectroZone</span>
        </h2>

        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-slate-300 w-full p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-orange-600"
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-slate-300 w-full p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-orange-600"
        />

        <input
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border border-slate-300 w-full p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-orange-600"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-slate-300 w-full p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-orange-600"
        />

        <button
          onClick={handleRegister}
          disabled={loading}
          className="bg-orange-600 text-white w-full py-3 rounded disabled:opacity-60"
        >
          {loading ? "Sending OTP..." : "Register"}
        </button>

        <p className="text-sm mt-4 text-center">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-orange-600 hover:underline font-medium"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
