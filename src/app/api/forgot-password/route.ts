import connectDB from "@/lib/db";
import Otp from "@/models/Otp";
import User from "@/models/User";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    await Otp.deleteMany({ email });

    await Otp.create({
      email,
      otp,
      payload: { reset: true },
      expiresAt: new Date(Date.now() + 60 * 1000),
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"ElectroZone" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Password OTP",
      html: `<h2>Your OTP is <b>${otp}</b><br/>Valid for 1 minute</h2>`,
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("FORGOT OTP ERROR:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
