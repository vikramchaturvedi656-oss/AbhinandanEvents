import express from "express";
import Booking from "../models/booking.model.js";
import Planner from "../models/planner.model.js";
import User from "../models/user.model.js";
import { requireAdmin } from "../middleware/auth.middleware.js";
import ensureSeedData from "../utils/ensureSeedData.js";
import {
  ACTIVE_STATUSES,
  evaluatePlannerAvailability,
  generateAlternativeSlots,
  parseDateTime,
} from "../utils/booking.utils.js";

const router = express.Router();

const getPlannerBookings = async (plannerId) =>
  Booking.find({
    plannerId,
    status: { $in: ACTIVE_STATUSES },
  }).sort({ startDateTime: 1 });

const buildRequestedWindow = (planner, eventDate, eventTime, durationMinutes) => {
  const resolvedDuration =
    Number(durationMinutes) || planner.availability?.defaultDurationMinutes || 180;
  const startDateTime = parseDateTime(eventDate, eventTime);
  const endDateTime = new Date(
    startDateTime.getTime() + resolvedDuration * 60 * 1000
  );

  return {
    durationMinutes: resolvedDuration,
    startDateTime,
    endDateTime,
  };
};

router.post("/availability", async (req, res) => {
  try {
    await ensureSeedData();

    const { plannerId, eventDate, eventTime, durationMinutes } = req.body;

    if (!plannerId || !eventDate || !eventTime) {
      return res.status(400).json({
        message: "Planner, event date, and event time are required.",
      });
    }

    const planner = await Planner.findById(plannerId);

    if (!planner) {
      return res.status(404).json({ message: "Planner not found." });
    }

    const requestedWindow = buildRequestedWindow(
      planner,
      eventDate,
      eventTime,
      durationMinutes
    );

    if (requestedWindow.startDateTime <= new Date()) {
      return res.status(400).json({
        message: "Please choose a future date and time for the event.",
      });
    }

    const bookings = await getPlannerBookings(plannerId);
    const availability = evaluatePlannerAvailability({
      planner,
      bookings,
      startDateTime: requestedWindow.startDateTime,
      endDateTime: requestedWindow.endDateTime,
    });
    const alternativeSlots = availability.available
      ? []
      : generateAlternativeSlots({
          planner,
          bookings,
          requestedStart: requestedWindow.startDateTime,
          durationMinutes: requestedWindow.durationMinutes,
        });

    res.json({
      available: availability.available,
      message: availability.reason,
      planner,
      requestedSlot: {
        eventDate,
        eventTime,
        durationMinutes: requestedWindow.durationMinutes,
      },
      alternativeSlots,
    });
  } catch (error) {
    console.error("Availability check error:", error);
    res.status(500).json({ message: "Unable to check availability right now." });
  }
});

router.post("/", async (req, res) => {
  try {
    await ensureSeedData();

    const {
      plannerId,
      fullName,
      contactNumber,
      emailAddress,
      eventType,
      eventDate,
      eventTime,
      venue,
      guestCount,
      budgetRange,
      specialRequirements = "",
      durationMinutes,
      userId,
    } = req.body;

    if (
      !plannerId ||
      !fullName ||
      !contactNumber ||
      !emailAddress ||
      !eventType ||
      !eventDate ||
      !eventTime ||
      !venue ||
      !guestCount ||
      !budgetRange ||
      !specialRequirements
    ) {
      return res.status(400).json({ message: "Please complete all required fields." });
    }

    const planner = await Planner.findById(plannerId);

    if (!planner) {
      return res.status(404).json({ message: "Planner not found." });
    }

    const requestedWindow = buildRequestedWindow(
      planner,
      eventDate,
      eventTime,
      durationMinutes
    );

    if (Number(guestCount) <= 0) {
      return res.status(400).json({ message: "Guest count must be at least 1." });
    }

    if (requestedWindow.startDateTime <= new Date()) {
      return res.status(400).json({
        message: "Please choose a future date and time for the event.",
      });
    }

    const plannerBookings = await getPlannerBookings(plannerId);
    const availability = evaluatePlannerAvailability({
      planner,
      bookings: plannerBookings,
      startDateTime: requestedWindow.startDateTime,
      endDateTime: requestedWindow.endDateTime,
    });

    if (!availability.available) {
      return res.status(409).json({
        message: availability.reason,
        alternativeSlots: generateAlternativeSlots({
          planner,
          bookings: plannerBookings,
          requestedStart: requestedWindow.startDateTime,
          durationMinutes: requestedWindow.durationMinutes,
        }),
      });
    }

    const normalizedEmail = emailAddress.trim().toLowerCase();
    const duplicateBooking = await Booking.findOne({
      plannerId,
      "customer.emailAddress": normalizedEmail,
      eventDate,
      eventTime,
      venue: venue.trim(),
      status: { $in: ACTIVE_STATUSES },
    });

    if (duplicateBooking) {
      return res.status(409).json({
        message: "A matching booking already exists for this planner and slot.",
      });
    }

    let resolvedUserId = null;

    if (userId) {
      resolvedUserId = userId;
    } else {
      const user = await User.findOne({ email: normalizedEmail }).select("_id");
      resolvedUserId = user?._id || null;
    }

    const booking = await Booking.create({
      plannerId: planner._id,
      plannerName: planner.name,
      plannerContact: planner.contact,
      userId: resolvedUserId,
      customer: {
        fullName: fullName.trim(),
        contactNumber: contactNumber.trim(),
        emailAddress: normalizedEmail,
      },
      eventType: eventType.trim(),
      eventDate,
      eventTime,
      startDateTime: requestedWindow.startDateTime,
      endDateTime: requestedWindow.endDateTime,
      venue: venue.trim(),
      guestCount: Number(guestCount),
      budgetRange: budgetRange.trim(),
      specialRequirements: specialRequirements.trim(),
      status: "Confirmed",
      assignedStaff: planner.assignedTeam.slice(0, 2),
    });

    res.status(201).json({
      message: "Booking confirmed successfully.",
      booking,
    });
  } catch (error) {
    console.error("Booking creation error:", error);
    res.status(500).json({ message: "Unable to confirm the booking right now." });
  }
});

router.get("/", async (req, res) => {
  try {
    const { email, userId, plannerId, status } = req.query;
    const filters = {};

    if (email) {
      filters["customer.emailAddress"] = String(email).trim().toLowerCase();
    }

    if (userId) {
      filters.userId = userId;
    }

    if (plannerId) {
      filters.plannerId = plannerId;
    }

    if (status) {
      filters.status = status;
    }

    const bookings = await Booking.find(filters)
      .populate("plannerId")
      .sort({ startDateTime: 1 });

    res.json({ bookings });
  } catch (error) {
    console.error("Booking list error:", error);
    res.status(500).json({ message: "Unable to load bookings right now." });
  }
});

router.patch("/:id/status", requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Pending", "Confirmed", "Cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid booking status." });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    booking.status = status;
    await booking.save();

    res.json({
      message: "Booking status updated successfully.",
      booking,
    });
  } catch (error) {
    console.error("Booking status update error:", error);
    res.status(500).json({ message: "Unable to update booking status." });
  }
});

export default router;
