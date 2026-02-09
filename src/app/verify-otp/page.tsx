"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, Suspense } from "react";

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [resending, setResending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const inputsRef = useRef<HTMLInputElement[]>([]);

  // countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    // handle full OTP paste
    if (value.length === 4) {
      const split = value.split("").slice(0, 4);
      setOtp(split);
      inputsRef.current[3]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const finalOtp = otp.join("");

    if (finalOtp.length !== 4) {
      alert("Enter 4 digit OTP");
      return;
    }

    setVerifying(true);

    const res = await fetch("/api/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp: finalOtp }),
    });

    const data = await res.json();

    if (data.success) {
      if (data.type === "reset") {
        router.push(`/reset-password?email=${email}`);
      } else {
        router.push("/login");
      }
    } else {
      alert(data.message || "Invalid OTP");
    }

    setVerifying(false);
  };

  const handleResend = async () => {
    setResending(true);

    await fetch("/api/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, type: "reset" }),
    });

    setOtp(["", "", "", ""]);
    setTimer(60);
    inputsRef.current[0]?.focus();
    setResending(false);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-orange-50 to-white px-4">
      <div className="bg-white border border-slate-200 shadow-lg p-8 rounded-lg w-full max-w-md">

        <h2 className="text-2xl font-bold mb-2 text-center">
          Verify <span className="text-orange-600">OTP</span>
        </h2>

        <p className="text-sm text-center text-gray-600 mb-6">
          OTP sent to <b>{email}</b>
        </p>

        {/* OTP Boxes */}
        <div className="flex justify-center gap-3 mb-6">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                if (el) inputsRef.current[i] = el;
              }}
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              inputMode="numeric"
              maxLength={4}
              className="w-14 h-14 text-center text-xl border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-600"
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={verifying}
          className="bg-orange-600 hover:bg-orange-700 text-white w-full py-3 rounded font-medium transition disabled:opacity-60"
        >
          {verifying ? "Verifying..." : "Verify OTP"}
        </button>

        <div className="text-center mt-4 text-sm text-gray-600">
          {timer > 0 ? (
            <p>Resend OTP in <b>{timer}s</b></p>
          ) : (
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-orange-600 hover:underline font-medium"
            >
              {resending ? "Sending..." : "Resend OTP"}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

export default function VerifyOtp() {
  return (
    <Suspense fallback={<div className="min-h-screen flex justify-center items-center">Loading...</div>}>
      <VerifyOtpForm />
    </Suspense>
  );
}
