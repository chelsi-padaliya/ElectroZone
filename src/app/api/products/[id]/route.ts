import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

async function getParams(params: Promise<{ id: string }>) {
  const { id } = await params;
  return id;
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = await getParams(params);
    await connectDB();
    const product = await Product.findById(id).lean();
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error("GET /api/products/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = await getParams(params);
    await connectDB();
    const body = await request.json();
    const { name, description, category, price, offerPrice, image } = body;

    const update: Record<string, unknown> = {};
    if (name != null) update.name = name;
    if (description != null) update.description = description;
    if (category != null) update.category = category;
    if (price != null) update.price = Number(price);
    if (offerPrice != null) update.offerPrice = Number(offerPrice);
    if (image != null) update.image = image;

    const product = await Product.findByIdAndUpdate(id, { $set: update }, { new: true }).lean();
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error("PUT /api/products/[id] error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = await getParams(params);
    await connectDB();
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/products/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
