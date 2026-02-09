import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    offerPrice: { type: Number },
    image: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", productSchema);
