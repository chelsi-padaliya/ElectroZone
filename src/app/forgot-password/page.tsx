"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { validate } from "@/lib/validation";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    if (!validate.email(email)) return alert("Invalid email format");

    setLoading(true);

    const res = await fetch("/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (data.success) {
      router.push(`/reset-password?email=${email}`);
    } else {
      alert(data.message || "Failed to send OTP");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-orange-50 to-white px-4">
      <div className="bg-white p-8 rounded border w-full max-w-md">

        <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>

        <input
          placeholder="Enter your email"
          className="border w-full p-3 mb-4 rounded"
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={sendOtp}
          disabled={loading}
          className="bg-orange-600 text-white w-full py-3 rounded disabled:opacity-60"
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>

      </div>
    </div>
  );
}
