import connectDB from "@/lib/db";
import Otp from "@/models/Otp";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({
        success: false,
        message: "Email and OTP required",
      });
    }

    const record = await Otp.findOne({ email }).sort({ createdAt: -1 });

    if (!record) {
      return NextResponse.json({ success: false, message: "OTP expired" });
    }

    if (record.otp !== otp.toString().trim()) {
      return NextResponse.json({ success: false, message: "Invalid OTP" });
    }

    if (record.expiresAt < new Date()) {
      await Otp.deleteMany({ email });
      return NextResponse.json({ success: false, message: "OTP expired" });
    }

    // 👉 REGISTER FLOW
    if (record.type === "register") {
      if (!record.payload) {
        return NextResponse.json({
          success: false,
          message: "Registration expired. Try again.",
        });
      }

      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(record.payload.password, 10);
        await User.create({
          ...record.payload,
          password: hashedPassword,
        });
      }
    }

    await Otp.deleteMany({ email });

    // 🔥 send back OTP type so frontend can redirect properly
    return NextResponse.json({
      success: true,
      type: record.type,
    });

  } catch (err: any) {
    console.error("VERIFY OTP ERROR:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Server error" },
      { status: 500 }
    );
  }
}
