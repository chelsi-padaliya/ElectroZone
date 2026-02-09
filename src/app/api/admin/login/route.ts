import connectDB from "@/lib/db";
import AdminUser from "@/models/AdminUser";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    const admin = await AdminUser.findOne({ email, password });

    if (!admin) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      admin
    });

  } catch (error) {
    console.error("ADMIN LOGIN ERROR:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
