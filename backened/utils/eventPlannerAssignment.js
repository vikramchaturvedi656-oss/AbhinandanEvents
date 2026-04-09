import {
  haversineDistanceKm,
  normalizeText,
  resolveLocationToCoordinates,
} from "./location.utils.js";

const scoreLocationMatch = (planner, requestedLocation) => {
  const normalizedLocation = normalizeText(requestedLocation);
  const serviceAreas = [planner.location, ...(planner.serviceAreas || [])]
    .filter(Boolean)
    .map(normalizeText);

  if (!normalizedLocation) {
    return 1;
  }

  for (const area of serviceAreas) {
    if (
      normalizedLocation === area ||
      normalizedLocation.includes(area) ||
      area.includes(normalizedLocation)
    ) {
      return 4;
    }

    const areaWords = area.split(/[\s,/-]+/).filter(Boolean);
    if (areaWords.some((word) => normalizedLocation.includes(word))) {
      return 3;
    }
  }

  if (serviceAreas.some((area) => area.includes("delhi ncr"))) {
    return 2;
  }

  if (normalizedLocation.includes("remote") && serviceAreas.includes("remote")) {
    return 4;
  }

  return 0;
};

const matchesEventType = (planner, eventSlug) => {
  const supportedEventSlugs = planner.supportedEventSlugs || [];
  return supportedEventSlugs.includes(eventSlug);
};

const scoreDistanceMatch = (distanceKm) => {
  if (typeof distanceKm !== "number") {
    return 0;
  }

  if (distanceKm <= 8) {
    return 5;
  }

  if (distanceKm <= 20) {
    return 4;
  }

  if (distanceKm <= 35) {
    return 3;
  }

  if (distanceKm <= 60) {
    return 2;
  }

  if (distanceKm <= 90) {
    return 1;
  }

  return 0;
};

const resolvePlannerCoordinates = (planner) => {
  if (
    typeof planner.coordinates?.latitude === "number" &&
    typeof planner.coordinates?.longitude === "number"
  ) {
    return planner.coordinates;
  }

  return resolveLocationToCoordinates(
    [planner.sector, planner.location].filter(Boolean).join(", ")
  );
};

const rankCandidatePlanners = ({ planners, eventSlug, eventLocation }) => {
  const requestedLocation = resolveLocationToCoordinates(eventLocation);

  return planners
    .filter((planner) => matchesEventType(planner, eventSlug))
    .map((planner) => ({
      planner,
      locationScore: scoreLocationMatch(planner, eventLocation),
      distanceKm: haversineDistanceKm(
        requestedLocation,
        resolvePlannerCoordinates(planner)
      ),
      requestedLocation,
    }))
    .map((entry) => ({
      ...entry,
      distanceScore: scoreDistanceMatch(entry.distanceKm),
      combinedScore:
        entry.locationScore * 3 +
        scoreDistanceMatch(entry.distanceKm) * 2 +
        (entry.planner.rating || 0),
    }))
    .filter(
      (entry) =>
        !normalizeText(eventLocation) ||
        entry.locationScore > 0 ||
        entry.distanceScore > 0
    )
    .sort((first, second) => {
      if (second.combinedScore !== first.combinedScore) {
        return second.combinedScore - first.combinedScore;
      }

      if ((first.distanceKm ?? Infinity) !== (second.distanceKm ?? Infinity)) {
        return (first.distanceKm ?? Infinity) - (second.distanceKm ?? Infinity);
      }

      if (second.locationScore !== first.locationScore) {
        return second.locationScore - first.locationScore;
      }

      if ((second.planner.rating || 0) !== (first.planner.rating || 0)) {
        return (second.planner.rating || 0) - (first.planner.rating || 0);
      }

      return first.planner.name.localeCompare(second.planner.name);
    });
};

export { rankCandidatePlanners };
