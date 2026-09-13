import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import { getCurrentUserId } from "@/lib/session";
import Product from "@/models/Product";
import User from "@/models/User";

async function getUserId(request: NextRequest) {
  const userId = getCurrentUserId(request);
  if (!userId || !mongoose.isValidObjectId(userId)) return null;
  return userId;
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId(request);
    if (!userId) return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 });

    await connectDB();
    const user = await User.findById(userId).populate("wishlist").lean();
    if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    const productId = request.nextUrl.searchParams.get("productId");
    if (productId) {
      if (!mongoose.isValidObjectId(productId)) return NextResponse.json({ success: false, message: "Valid product ID required" }, { status: 400 });
      const wishlistIds = (user.wishlist ?? []).map((product: { _id: mongoose.Types.ObjectId }) => product._id.toString());
      return NextResponse.json({ success: true, isWishlisted: wishlistIds.includes(productId) });
    }
    return NextResponse.json({ success: true, products: user.wishlist ?? [] });
  } catch (error) {
    console.error("GET WISHLIST ERROR:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch wishlist" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId(request);
    if (!userId) return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 });

    const { productId } = await request.json();
    if (!mongoose.isValidObjectId(productId)) return NextResponse.json({ success: false, message: "Valid product ID required" }, { status: 400 });

    await connectDB();
    const product = await Product.exists({ _id: productId });
    if (!product) return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });

    await User.findByIdAndUpdate(userId, { $addToSet: { wishlist: productId } });
    return NextResponse.json({ success: true, productId });
  } catch (error) {
    console.error("ADD WISHLIST ERROR:", error);
    return NextResponse.json({ success: false, message: "Failed to add to wishlist" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUserId(request);
    if (!userId) return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 });

    const { productId } = await request.json();
    if (!mongoose.isValidObjectId(productId)) return NextResponse.json({ success: false, message: "Valid product ID required" }, { status: 400 });

    await connectDB();
    await User.findByIdAndUpdate(userId, { $pull: { wishlist: productId } });
    return NextResponse.json({ success: true, productId });
  } catch (error) {
    console.error("REMOVE WISHLIST ERROR:", error);
    return NextResponse.json({ success: false, message: "Failed to remove from wishlist" }, { status: 500 });
  }
}
