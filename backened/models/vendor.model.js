import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    businessName: { type: String, required: true },
    serviceType: { type: String, required: true },
    location: { type: String, required: true },

    priceRange: String,
    description: String,

    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Vendor = mongoose.model("Vendor", vendorSchema);
export default Vendor;