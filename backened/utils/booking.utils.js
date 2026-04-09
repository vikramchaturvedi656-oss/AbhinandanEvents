const ACTIVE_STATUSES = ["Pending", "Confirmed"];

const pad = (value) => String(value).padStart(2, "0");

const formatDateKey = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const timeToMinutes = (timeValue) => {
  const [hours, minutes] = String(timeValue).split(":").map(Number);
  return hours * 60 + minutes;
};

const minutesToTime = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${pad(hours)}:${pad(minutes)}`;
};

const parseDateTime = (eventDate, eventTime) => {
  const [year, month, day] = String(eventDate).split("-").map(Number);
  const [hours, minutes] = String(eventTime).split(":").map(Number);

  if (!year || month == null || !day || hours == null || minutes == null) {
    throw new Error("Invalid event date or time.");
  }

  return new Date(year, month - 1, day, hours, minutes, 0, 0);
};

const hasOverlap = (firstStart, firstEnd, secondStart, secondEnd) =>
  firstStart < secondEnd && secondStart < firstEnd;

const findOverlappingBookings = (bookings, startDateTime, endDateTime) =>
  bookings.filter((booking) => {
    if (!ACTIVE_STATUSES.includes(booking.status)) {
      return false;
    }

    return hasOverlap(
      startDateTime,
      endDateTime,
      new Date(booking.startDateTime),
      new Date(booking.endDateTime)
    );
  });

const isPlannerWorkingOnDate = (planner, date) => {
  const availability = planner.availability || {};
  const workingDays = availability.workingDays || [];
  const blackoutDates = availability.blackoutDates || [];
  const dateKey = formatDateKey(date);

  return (
    availability.acceptingBookings !== false &&
    workingDays.includes(date.getDay()) &&
    !blackoutDates.includes(dateKey)
  );
};

const isWithinWorkingHours = (planner, startDateTime, endDateTime) => {
  const availability = planner.availability || {};
  const startMinutes = timeToMinutes(availability.startHour || "10:00");
  const endMinutes = timeToMinutes(availability.endHour || "19:00");
  const requestedStartMinutes =
    startDateTime.getHours() * 60 + startDateTime.getMinutes();
  const requestedEndMinutes =
    endDateTime.getHours() * 60 + endDateTime.getMinutes();

  return requestedStartMinutes >= startMinutes && requestedEndMinutes <= endMinutes;
};

const evaluatePlannerAvailability = ({
  planner,
  bookings,
  startDateTime,
  endDateTime,
}) => {
  if (!planner) {
    return {
      available: false,
      reason: "Planner not found.",
      conflicts: [],
    };
  }

  if (!isPlannerWorkingOnDate(planner, startDateTime)) {
    return {
      available: false,
      reason: "Planner is not accepting bookings for that day.",
      conflicts: [],
    };
  }

  if (!isWithinWorkingHours(planner, startDateTime, endDateTime)) {
    return {
      available: false,
      reason: "Requested time falls outside the planner's working hours.",
      conflicts: [],
    };
  }

  const conflicts = findOverlappingBookings(bookings, startDateTime, endDateTime);

  if (conflicts.length > 0) {
    return {
      available: false,
      reason: "Planner is already booked for the requested slot.",
      conflicts,
    };
  }

  return {
    available: true,
    reason: "Planner is available for the requested slot.",
    conflicts: [],
  };
};

const generateAlternativeSlots = ({
  planner,
  bookings,
  requestedStart,
  durationMinutes,
  limit = 4,
}) => {
  const suggestions = [];
  const intervalMinutes = planner.availability?.slotIntervalMinutes || 60;
  const availability = planner.availability || {};
  const workingStart = timeToMinutes(availability.startHour || "10:00");
  const workingEnd = timeToMinutes(availability.endHour || "19:00");
  const baseDate = new Date(requestedStart);

  baseDate.setHours(0, 0, 0, 0);

  for (let dayOffset = 0; dayOffset < 7 && suggestions.length < limit; dayOffset += 1) {
    const dayDate = new Date(baseDate);
    dayDate.setDate(baseDate.getDate() + dayOffset);

    if (!isPlannerWorkingOnDate(planner, dayDate)) {
      continue;
    }

    for (
      let slotMinute = workingStart;
      slotMinute <= workingEnd - durationMinutes && suggestions.length < limit;
      slotMinute += intervalMinutes
    ) {
      const slotDateKey = formatDateKey(dayDate);
      const slotTime = minutesToTime(slotMinute);
      const slotStart = parseDateTime(slotDateKey, slotTime);
      const slotEnd = new Date(slotStart.getTime() + durationMinutes * 60 * 1000);

      if (slotStart <= requestedStart) {
        continue;
      }

      const slotAvailability = evaluatePlannerAvailability({
        planner,
        bookings,
        startDateTime: slotStart,
        endDateTime: slotEnd,
      });

      if (slotAvailability.available) {
        suggestions.push({
          date: slotDateKey,
          time: slotTime,
          endsAt: minutesToTime(slotMinute + durationMinutes),
        });
      }
    }
  }

  return suggestions;
};

const findBookingConflicts = (bookings) => {
  const conflictIds = new Set();
  const activeBookings = bookings.filter((booking) =>
    ACTIVE_STATUSES.includes(booking.status)
  );

  for (let index = 0; index < activeBookings.length; index += 1) {
    for (let innerIndex = index + 1; innerIndex < activeBookings.length; innerIndex += 1) {
      const current = activeBookings[index];
      const compared = activeBookings[innerIndex];

      const currentPlannerId = String(current.plannerId?._id || current.plannerId);
      const comparedPlannerId = String(compared.plannerId?._id || compared.plannerId);

      if (currentPlannerId !== comparedPlannerId) {
        continue;
      }

      if (
        hasOverlap(
          new Date(current.startDateTime),
          new Date(current.endDateTime),
          new Date(compared.startDateTime),
          new Date(compared.endDateTime)
        )
      ) {
        conflictIds.add(String(current._id));
        conflictIds.add(String(compared._id));
      }
    }
  }

  return conflictIds;
};

export {
  ACTIVE_STATUSES,
  evaluatePlannerAvailability,
  findBookingConflicts,
  formatDateKey,
  generateAlternativeSlots,
  parseDateTime,
};
