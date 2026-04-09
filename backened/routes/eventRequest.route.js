import express from "express";
import Booking from "../models/booking.model.js";
import EventCatalog from "../models/eventCatalog.model.js";
import Planner from "../models/planner.model.js";
import EventRequest from "../models/eventRequest.model.js";
import User from "../models/user.model.js";
import ensureSeedData from "../utils/ensureSeedData.js";
import { evaluatePlannerAvailability, parseDateTime } from "../utils/booking.utils.js";
import { getPlannerRecommendations } from "../utils/plannerRecommendations.js";

const router = express.Router();

router.post("/preview-assignment", async (req, res) => {
  try {
    await ensureSeedData();

    const {
      eventSlug,
      eventLocation,
      eventDate = "",
      eventTime = "",
      durationMinutes = 180,
    } = req.body;

    if (!eventSlug || !eventLocation) {
      return res.status(400).json({
        message: "Event type and location are required to find nearby vendors.",
      });
    }

    const planners = await Planner.find({
      supportedEventSlugs: String(eventSlug).trim(),
    }).sort({ rating: -1, name: 1 });

    const { nearbyPlanners, requestedLocation } = await getPlannerRecommendations({
      planners,
      eventSlug: String(eventSlug).trim(),
      location: String(eventLocation).trim(),
      eventDate,
      eventTime,
      durationMinutes,
      limit: 5,
    });

    const assignedPlanner =
      nearbyPlanners.find((planner) => planner.available === true) ||
      nearbyPlanners[0] ||
      null;

    res.json({
      message: assignedPlanner
        ? `Best nearby match: ${assignedPlanner.name}.`
        : "No nearby vendor match found yet.",
      requestedLocation: {
        raw: String(eventLocation).trim(),
        resolved: requestedLocation?.label || String(eventLocation).trim(),
      },
      assignedPlanner,
      nearbyPlanners,
    });
  } catch (error) {
    console.error("Event request preview error:", error);
    res.status(500).json({ message: "Unable to preview nearby vendors right now." });
  }
});

router.post("/", async (req, res) => {
  try {
    await ensureSeedData();

    const {
      userId,
      eventSlug,
      selectedPackage,
      fullName,
      contactNumber,
      emailAddress,
      eventDate,
      eventTime,
      durationMinutes = 180,
      eventLocation,
      guestCount,
      budgetRange,
      specialRequirements = "",
    } = req.body;

    if (
      !eventSlug ||
      !selectedPackage?.name ||
      !selectedPackage?.price ||
      !fullName ||
      !contactNumber ||
      !emailAddress ||
      !eventDate ||
      !eventTime ||
      !eventLocation ||
      !guestCount ||
      !budgetRange
    ) {
      return res
        .status(400)
        .json({ message: "Please complete all required booking details." });
    }

    if (Number(guestCount) <= 0) {
      return res.status(400).json({ message: "Guest count must be at least 1." });
    }

    const eventRecord = await EventCatalog.findOne({ slug: String(eventSlug).trim() });

    if (!eventRecord) {
      return res.status(404).json({ message: "Selected event was not found in the database." });
    }

    const matchedPackage = (eventRecord.packages || []).find(
      (pkg) =>
        pkg.name === String(selectedPackage.name).trim() &&
        pkg.price === String(selectedPackage.price).trim()
    );

    if (!matchedPackage) {
      return res.status(400).json({ message: "Selected package is not valid for this event." });
    }

    const normalizedEmail = String(emailAddress).trim().toLowerCase();
    let resolvedUserId = null;

    if (userId) {
      resolvedUserId = userId;
    } else {
      const user = await User.findOne({ email: normalizedEmail }).select("_id");
      resolvedUserId = user?._id || null;
    }

    const planners = await Planner.find({
      supportedEventSlugs: String(eventSlug).trim(),
    }).sort({ rating: -1, name: 1 });

    const requestedStart = parseDateTime(eventDate, eventTime);
    if (requestedStart <= new Date()) {
      return res
        .status(400)
        .json({ message: "Please choose a future date and time for the event." });
    }

    const requestedEnd = new Date(
      requestedStart.getTime() + Number(durationMinutes) * 60 * 1000
    );

    const { rankedCandidates, nearbyPlanners } = await getPlannerRecommendations({
      planners,
      eventSlug: String(eventSlug).trim(),
      location: String(eventLocation).trim(),
      eventDate,
      eventTime,
      durationMinutes,
      limit: 5,
    });

    let assignedPlanner = null;
    let assignmentNotes = "No nearby planner was available for the selected date and location.";
    let booking = null;

    for (const candidate of rankedCandidates) {
      const plannerBookings = await Booking.find({
        plannerId: candidate.planner._id,
        status: { $in: ["Pending", "Confirmed"] },
      }).sort({ startDateTime: 1 });

      const availability = evaluatePlannerAvailability({
        planner: candidate.planner,
        bookings: plannerBookings,
        startDateTime: requestedStart,
        endDateTime: requestedEnd,
      });

      if (availability.available) {
        assignedPlanner = candidate.planner;
        assignmentNotes = `Auto-assigned to ${candidate.planner.name} based on ${eventLocation} and live availability.`;
        break;
      }

      assignmentNotes = availability.reason;
    }

    if (assignedPlanner) {
      booking = await Booking.create({
        plannerId: assignedPlanner._id,
        plannerName: assignedPlanner.name,
        plannerContact: assignedPlanner.contact,
        userId: resolvedUserId,
        customer: {
          fullName: String(fullName).trim(),
          contactNumber: String(contactNumber).trim(),
          emailAddress: normalizedEmail,
        },
        eventType: eventRecord.name,
        eventDate,
        eventTime,
        startDateTime: requestedStart,
        endDateTime: requestedEnd,
        venue: String(eventLocation).trim(),
        guestCount: Number(guestCount),
        budgetRange: String(budgetRange).trim(),
        specialRequirements: String(specialRequirements).trim(),
        status: "Pending",
        assignedStaff: assignedPlanner.assignedTeam.slice(0, 2),
      });
    }

    const eventRequest = await EventRequest.create({
      userId: resolvedUserId,
      eventSlug: String(eventSlug).trim(),
      eventName: eventRecord.name,
      selectedPackage: {
        name: matchedPackage.name,
        price: matchedPackage.price,
      },
      eventTime,
      durationMinutes: Number(durationMinutes),
      customer: {
        fullName: String(fullName).trim(),
        contactNumber: String(contactNumber).trim(),
        emailAddress: normalizedEmail,
      },
      eventDate,
      eventLocation: String(eventLocation).trim(),
      guestCount: Number(guestCount),
      budgetRange: String(budgetRange).trim(),
      specialRequirements: String(specialRequirements).trim(),
      status: "Pending",
      assignedPlannerId: assignedPlanner?._id || null,
      assignedPlannerName: assignedPlanner?.name || "",
      assignedPlannerLocation: assignedPlanner
        ? `${assignedPlanner.location}, ${assignedPlanner.sector}`
        : "",
      linkedBookingId: booking?._id || null,
      assignmentStatus: assignedPlanner ? "Assigned" : "Unassigned",
      assignmentNotes,
    });

    res.status(201).json({
      message: assignedPlanner
        ? `Booking request saved and matched with ${assignedPlanner.name}. It is now pending admin approval.`
        : "Booking request saved, but no nearby planner was free for that date. Admin can still review it manually.",
      eventRequest,
      assignedPlanner,
      nearbyPlanners,
      booking,
    });
  } catch (error) {
    console.error("Event request creation error:", error);
    res
      .status(500)
      .json({ message: "Unable to save the event booking request right now." });
  }
});

export default router;
