import mongoose from "mongoose";

const plannerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    specialization: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      default: "Noida",
      trim: true,
    },
    sector: {
      type: String,
      trim: true,
    },
    serviceAreas: {
      type: [String],
      default: [],
    },
    coordinates: {
      latitude: {
        type: Number,
        default: null,
      },
      longitude: {
        type: Number,
        default: null,
      },
    },
    supportedEventSlugs: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 4.5,
    },
    startingPrice: {
      type: String,
      required: true,
      trim: true,
    },
    contact: {
      phone: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },
    },
    image: {
      type: String,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    assignedTeam: {
      type: [String],
      default: [],
    },
    availability: {
      acceptingBookings: {
        type: Boolean,
        default: true,
      },
      workingDays: {
        type: [Number],
        default: [1, 2, 3, 4, 5, 6],
      },
      startHour: {
        type: String,
        default: "10:00",
      },
      endHour: {
        type: String,
        default: "19:00",
      },
      slotIntervalMinutes: {
        type: Number,
        default: 120,
      },
      defaultDurationMinutes: {
        type: Number,
        default: 180,
      },
      blackoutDates: {
        type: [String],
        default: [],
      },
    },
  },
  { timestamps: true }
);

const Planner = mongoose.model("Planner", plannerSchema);

export default Planner;
