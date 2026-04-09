import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    plannerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Planner",
      required: true,
      index: true,
    },
    plannerName: {
      type: String,
      required: true,
      trim: true,
    },
    plannerContact: {
      phone: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    customer: {
      fullName: {
        type: String,
        required: true,
        trim: true,
      },
      contactNumber: {
        type: String,
        required: true,
        trim: true,
      },
      emailAddress: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },
    },
    eventType: {
      type: String,
      required: true,
      trim: true,
    },
    eventDate: {
      type: String,
      required: true,
    },
    eventTime: {
      type: String,
      required: true,
    },
    startDateTime: {
      type: Date,
      required: true,
      index: true,
    },
    endDateTime: {
      type: Date,
      required: true,
      index: true,
    },
    venue: {
      type: String,
      required: true,
      trim: true,
    },
    guestCount: {
      type: Number,
      required: true,
      min: 1,
    },
    budgetRange: {
      type: String,
      required: true,
      trim: true,
    },
    specialRequirements: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Confirmed",
      index: true,
    },
    assignedStaff: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

bookingSchema.index(
  { plannerId: 1, startDateTime: 1, endDateTime: 1, status: 1 },
  { name: "planner_schedule_lookup" }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
