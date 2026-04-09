import express from "express";
import Booking from "../models/booking.model.js";
import Planner from "../models/planner.model.js";
import { requireAdmin } from "../middleware/auth.middleware.js";
import { evaluatePlannerAvailability, parseDateTime } from "../utils/booking.utils.js";
import ensureSeedData from "../utils/ensureSeedData.js";
import { rankCandidatePlanners } from "../utils/eventPlannerAssignment.js";
import {
  buildMapEmbedUrl,
  resolveLocationToCoordinates,
} from "../utils/location.utils.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    await ensureSeedData();

    const { search = "", specialization = "", location = "" } = req.query;
    const filters = {};

    if (location) {
      filters.$or = [
        { location: { $regex: location, $options: "i" } },
        { serviceAreas: { $elemMatch: { $regex: location, $options: "i" } } },
      ];
    }

    if (specialization) {
      filters.specialization = { $regex: specialization, $options: "i" };
    }

    if (search) {
      const searchFilters = [
        { name: { $regex: search, $options: "i" } },
        { specialization: { $regex: search, $options: "i" } },
        { sector: { $regex: search, $options: "i" } },
        { serviceAreas: { $elemMatch: { $regex: search, $options: "i" } } },
      ];

      if (filters.$or) {
        filters.$and = [{ $or: filters.$or }, { $or: searchFilters }];
        delete filters.$or;
      } else {
        filters.$or = searchFilters;
      }
    }

    const planners = await Planner.find(filters).sort({ rating: -1, name: 1 });

    res.json({
      planners,
    });
  } catch (error) {
    console.error("Planner listing error:", error);
    res.status(500).json({ message: "Unable to load planners right now." });
  }
});

router.get("/recommendations", async (req, res) => {
  try {
    await ensureSeedData();

    const {
      eventSlug = "",
      location = "",
      eventDate = "",
      eventTime = "",
      durationMinutes = 180,
    } = req.query;

    if (!eventSlug || !location) {
      return res.status(400).json({
        message: "Event type and location are required to find nearby vendors.",
      });
    }

    const planners = await Planner.find({
      supportedEventSlugs: String(eventSlug).trim(),
    }).sort({ rating: -1, name: 1 });

    const rankedCandidates = rankCandidatePlanners({
      planners,
      eventSlug: String(eventSlug).trim(),
      eventLocation: String(location).trim(),
    });

    let requestedStart = null;
    let requestedEnd = null;

    if (eventDate && eventTime) {
      requestedStart = parseDateTime(eventDate, eventTime);
      requestedEnd = new Date(
        requestedStart.getTime() + Number(durationMinutes) * 60 * 1000
      );
    }

    const nearbyPlanners = await Promise.all(
      rankedCandidates.slice(0, 5).map(async (candidate) => {
        const planner = candidate.planner;
        let availability = {
          available: null,
          reason: "Choose a date and time to check live availability.",
        };

        if (requestedStart && requestedEnd) {
          const plannerBookings = await Booking.find({
            plannerId: planner._id,
            status: { $in: ["Pending", "Confirmed"] },
          }).sort({ startDateTime: 1 });

          availability = evaluatePlannerAvailability({
            planner,
            bookings: plannerBookings,
            startDateTime: requestedStart,
            endDateTime: requestedEnd,
          });
        }

        const mapLabel = [planner.name, planner.sector, planner.location]
          .filter(Boolean)
          .join(", ");

        return {
          _id: planner._id,
          name: planner.name,
          specialization: planner.specialization,
          summary: planner.summary,
          location: planner.location,
          sector: planner.sector,
          serviceAreas: planner.serviceAreas || [],
          rating: planner.rating,
          startingPrice: planner.startingPrice,
          contact: planner.contact,
          image: planner.image,
          tags: planner.tags || [],
          distanceKm:
            typeof candidate.distanceKm === "number"
              ? Number(candidate.distanceKm.toFixed(1))
              : null,
          available: availability.available,
          availabilityReason: availability.reason,
          mapLabel,
          mapEmbedUrl: buildMapEmbedUrl(mapLabel),
        };
      })
    );

    const recommendedPlanner =
      nearbyPlanners.find((planner) => planner.available === true) ||
      nearbyPlanners[0] ||
      null;

    res.json({
      location: {
        raw: String(location).trim(),
        resolved:
          resolveLocationToCoordinates(location)?.label || String(location).trim(),
        mapEmbedUrl: buildMapEmbedUrl(String(location).trim()),
      },
      nearbyPlanners,
      recommendedPlanner,
    });
  } catch (error) {
    console.error("Planner recommendations error:", error);
    res.status(500).json({ message: "Unable to load nearby vendors right now." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const planner = await Planner.findById(req.params.id);

    if (!planner) {
      return res.status(404).json({ message: "Planner not found." });
    }

    res.json({ planner });
  } catch (error) {
    console.error("Planner detail error:", error);
    res.status(500).json({ message: "Unable to load planner details." });
  }
});

router.patch("/:id/availability", requireAdmin, async (req, res) => {
  try {
    const planner = await Planner.findById(req.params.id);

    if (!planner) {
      return res.status(404).json({ message: "Planner not found." });
    }

    const {
      acceptingBookings,
      startHour,
      endHour,
      workingDays,
      blackoutDates,
    } = req.body;

    if (typeof acceptingBookings === "boolean") {
      planner.availability.acceptingBookings = acceptingBookings;
    }

    if (startHour) {
      planner.availability.startHour = startHour;
    }

    if (endHour) {
      planner.availability.endHour = endHour;
    }

    if (Array.isArray(workingDays)) {
      planner.availability.workingDays = workingDays.map(Number);
    }

    if (Array.isArray(blackoutDates)) {
      planner.availability.blackoutDates = blackoutDates;
    }

    await planner.save();

    res.json({
      message: "Planner availability updated successfully.",
      planner,
    });
  } catch (error) {
    console.error("Planner availability update error:", error);
    res.status(500).json({ message: "Unable to update planner availability." });
  }
});

export default router;
