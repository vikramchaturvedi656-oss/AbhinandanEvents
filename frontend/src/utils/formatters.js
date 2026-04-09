const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
});

export const formatEventDate = (dateValue) => {
  if (!dateValue) {
    return "TBD";
  }

  return dateFormatter.format(new Date(`${dateValue}T00:00:00`));
};

export const formatEventDateTime = (dateValue, timeValue) => {
  if (!dateValue || !timeValue) {
    return "Schedule pending";
  }

  const combined = new Date(`${dateValue}T${timeValue}:00`);

  return combined.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export const formatWorkingDays = (workingDays = []) => {
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return workingDays
    .slice()
    .sort((first, second) => first - second)
    .map((day) => dayLabels[day])
    .join(", ");
};
