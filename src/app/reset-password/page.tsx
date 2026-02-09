"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import { validate } from "@/lib/validation";

function ResetPasswordForm() {
  const params = useSearchParams();
  const router = useRouter();
  const email = params.get("email") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const resetPassword = async () => {
    if (!validate.required(password)) return alert("Password is required");
    if (!validate.password(password)) return alert("Password must be at least 6 characters");
    if (password !== confirmPassword) return alert("Passwords do not match");

    setLoading(true);

    const res = await fetch("/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword: password }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      alert("Password reset successful!");
      router.push("/login");
    } else {
      alert(data.message || "Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-orange-50 to-white px-4">
      <div className="bg-white p-8 rounded border w-full max-w-md">

        <h2 className="text-2xl font-bold mb-4 text-center">
          Reset Password
        </h2>

        <input
          type="password"
          placeholder="New Password"
          className="border w-full p-3 mb-3 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="border w-full p-3 mb-4 rounded"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          onClick={resetPassword}
          disabled={loading}
          className="bg-orange-600 hover:bg-orange-700 text-white w-full py-3 rounded disabled:opacity-60"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

      </div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={<div className="min-h-screen flex justify-center items-center">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
