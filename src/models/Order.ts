import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  image: { type: String },
});

const orderSchema = new mongoose.Schema(
  {
    items: [orderItemSchema],
    total: { type: Number, required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, default: "" },
    shippingAddress: { type: String, required: true },
    status: { type: String, default: "pending", enum: ["pending", "processing", "shipped", "delivered"] },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
