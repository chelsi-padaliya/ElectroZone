import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectDB();

    // The home page only displays the newest product from each category. Do
    // that selection in MongoDB so the browser does not download the whole
    // catalogue just to discard most of it.
    const products = await Product.aggregate([
      { $sort: { createdAt: -1 } },
      { $group: { _id: "$category", product: { $first: "$$ROOT" } } },
      { $replaceRoot: { newRoot: "$product" } },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          category: 1,
          price: 1,
          offerPrice: 1,
          image: 1,
          createdAt: 1,
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    return NextResponse.json(products);
  } catch (error) {
    console.error("GET /api/home-products error:", error);
    return NextResponse.json({ error: "Failed to fetch home products" }, { status: 500 });
  }
}
