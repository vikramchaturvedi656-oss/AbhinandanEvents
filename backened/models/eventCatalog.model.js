import mongoose from "mongoose";

const eventCatalogSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    desc: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    highlights: {
      type: [String],
      default: [],
    },
    packages: {
      type: [
        {
          name: { type: String, required: true, trim: true },
          price: { type: String, required: true, trim: true },
          items: { type: [String], default: [] },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

const EventCatalog = mongoose.model("EventCatalog", eventCatalogSchema);

export default EventCatalog;
