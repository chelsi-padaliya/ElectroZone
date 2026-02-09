import connectDB from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { name, email, phone, password } = await req.json();

    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { success: false, message: "All fields required" },
        { status: 400 }
      );
    }

    const exist = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (exist) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 400 }
      );
    }

    await User.create({ name, email, phone, password });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
