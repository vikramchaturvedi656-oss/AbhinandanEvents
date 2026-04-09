import mongoose from "mongoose";

const eventRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    eventSlug: {
      type: String,
      required: true,
      trim: true,
    },
    eventName: {
      type: String,
      required: true,
      trim: true,
    },
    selectedPackage: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      price: {
        type: String,
        required: true,
        trim: true,
      },
    },
    eventTime: {
      type: String,
      required: true,
    },
    durationMinutes: {
      type: Number,
      required: true,
      min: 60,
      default: 180,
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
    eventDate: {
      type: String,
      required: true,
    },
    eventLocation: {
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
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
      index: true,
    },
    adminNotes: {
      type: String,
      default: "",
      trim: true,
    },
    assignedPlannerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Planner",
      default: null,
    },
    assignedPlannerName: {
      type: String,
      default: "",
      trim: true,
    },
    assignedPlannerLocation: {
      type: String,
      default: "",
      trim: true,
    },
    linkedBookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
    },
    assignmentStatus: {
      type: String,
      enum: ["Assigned", "Unassigned"],
      default: "Unassigned",
    },
    assignmentNotes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

const EventRequest = mongoose.model("EventRequest", eventRequestSchema);

export default EventRequest;
