import connectDB from "@/lib/db";
import Otp from "@/models/Otp";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email, newPassword } = await req.json();

    if (!email || !newPassword) {
      return NextResponse.json({
        success: false,
        message: "Missing fields",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User not found",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.updateOne(
      { email },
      { password: hashedPassword }
    );

    // Clean OTPs after reset
    await Otp.deleteMany({ email });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
