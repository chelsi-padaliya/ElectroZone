import connectDB from "@/lib/db";
import Otp from "@/models/Otp";
import User from "@/models/User";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { name, email, phone, password, type } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, message: "Email required" });
    }

    const user = await User.findOne({ email });

    // Register flow
    if (!type && user) {
      return NextResponse.json({
        success: false,
        message: "User already exists",
      });
    }

    // Reset password flow
    if (type === "reset" && !user) {
      return NextResponse.json({
        success: false,
        message: "Account not found",
      });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    await Otp.deleteMany({ email });

    await Otp.create({
      email,
      otp,
      payload: type === "reset" ? null : { name, email, phone, password },
      expiresAt: new Date(Date.now() + 60 * 1000),
      type: type === "reset" ? "reset" : "register",
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
      subject: "Your OTP Code - ElectroZone",
      html: `
        <h2>ElectroZone Verification</h2>
        <h1 style="letter-spacing:4px">${otp}</h1>
        <p>This OTP expires in 1 minute</p>
      `,
    });

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("SEND OTP ERROR:", err);
    return NextResponse.json({ success: false, message: "Server error" });
  }
}
