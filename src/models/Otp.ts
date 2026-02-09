import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    payload: { type: Object, required: false },
    type: { type: String, default: "register" },
  },
  { timestamps: true }
);

export default mongoose.models.Otp || mongoose.model("Otp", OtpSchema);
