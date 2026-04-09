import Booking from "../models/booking.model.js";
import { evaluatePlannerAvailability, parseDateTime } from "./booking.utils.js";
import { rankCandidatePlanners } from "./eventPlannerAssignment.js";
import { buildMapEmbedUrl, resolveLocationToCoordinates } from "./location.utils.js";

const getPlannerRecommendations = async ({
  planners,
  eventSlug,
  location,
  eventDate = "",
  eventTime = "",
  durationMinutes = 180,
  limit = 5,
}) => {
  const rankedCandidates = rankCandidatePlanners({
    planners,
    eventSlug,
    eventLocation: location,
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
    rankedCandidates.slice(0, limit).map(async (candidate) => {
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
        locationScore: candidate.locationScore,
        distanceScore: candidate.distanceScore,
        combinedScore: Number(candidate.combinedScore.toFixed(2)),
        available: availability.available,
        availabilityReason: availability.reason,
        mapLabel,
        mapEmbedUrl: buildMapEmbedUrl(mapLabel),
      };
    })
  );

  return {
    nearbyPlanners,
    rankedCandidates,
    requestedLocation: resolveLocationToCoordinates(location),
  };
};

export { getPlannerRecommendations };
