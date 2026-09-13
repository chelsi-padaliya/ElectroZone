import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(products);
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, description, category, price, offerPrice, image } = body;

    if (!name || !category || price == null) {
      return NextResponse.json({ error: "Name, category, and price are required" }, { status: 400 });
    }

    const product = await Product.create({
      name,
      description: description || "",
      category,
      price: Number(price),
      offerPrice: offerPrice ? Number(offerPrice) : undefined,
      image: image || undefined,
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
