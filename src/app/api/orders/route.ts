import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";

export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("GET ORDERS ERROR:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const {
      items,
      total,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
    } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Cart empty" },
        { status: 400 }
      );
    }

    const order = await Order.create({
      items,
      total: Number(total),
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      status: "pending",
    });

    return NextResponse.json({ success: true, order });

  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
