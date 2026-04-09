const AREA_COORDINATES = {
  "sector 18": { label: "Sector 18, Noida", latitude: 28.5706, longitude: 77.3261 },
  "sector 50": { label: "Sector 50, Noida", latitude: 28.5733, longitude: 77.3638 },
  "sector 62": { label: "Sector 62, Noida", latitude: 28.6283, longitude: 77.3649 },
  "sector 76": { label: "Sector 76, Noida", latitude: 28.5678, longitude: 77.3824 },
  "sector 137": { label: "Sector 137, Noida", latitude: 28.5108, longitude: 77.4065 },
  "south delhi": { label: "South Delhi", latitude: 28.5355, longitude: 77.242 },
  "west delhi": { label: "West Delhi", latitude: 28.6667, longitude: 77.1 },
  "north delhi": { label: "North Delhi", latitude: 28.7269, longitude: 77.1425 },
  "cyber city": { label: "Cyber City, Gurgaon", latitude: 28.4947, longitude: 77.0894 },
  "golf course road": { label: "Golf Course Road, Gurgaon", latitude: 28.4381, longitude: 77.1015 },
  "raj nagar": { label: "Raj Nagar, Ghaziabad", latitude: 28.6762, longitude: 77.4435 },
  "greater noida": { label: "Greater Noida", latitude: 28.4744, longitude: 77.503 },
  ghaziabad: { label: "Ghaziabad", latitude: 28.6692, longitude: 77.4538 },
  gurgaon: { label: "Gurgaon", latitude: 28.4595, longitude: 77.0266 },
  faridabad: { label: "Faridabad", latitude: 28.4089, longitude: 77.3178 },
  "delhi ncr": { label: "Delhi NCR", latitude: 28.6139, longitude: 77.209 },
  delhi: { label: "Delhi", latitude: 28.6139, longitude: 77.209 },
  noida: { label: "Noida", latitude: 28.5355, longitude: 77.391 },
  remote: { label: "Remote", latitude: null, longitude: null },
};

const normalizeText = (value = "") =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

const resolveLocationToCoordinates = (value = "") => {
  const normalizedValue = normalizeText(value);

  if (!normalizedValue) {
    return null;
  }

  const entries = Object.entries(AREA_COORDINATES).sort(
    (first, second) => second[0].length - first[0].length
  );

  for (const [key, metadata] of entries) {
    if (normalizedValue.includes(key)) {
      return {
        key,
        ...metadata,
      };
    }
  }

  return null;
};

const toRadians = (value) => (value * Math.PI) / 180;

const haversineDistanceKm = (source, target) => {
  if (
    !source ||
    !target ||
    typeof source.latitude !== "number" ||
    typeof source.longitude !== "number" ||
    typeof target.latitude !== "number" ||
    typeof target.longitude !== "number"
  ) {
    return null;
  }

  const earthRadiusKm = 6371;
  const latitudeDelta = toRadians(target.latitude - source.latitude);
  const longitudeDelta = toRadians(target.longitude - source.longitude);
  const latitudeOne = toRadians(source.latitude);
  const latitudeTwo = toRadians(target.latitude);

  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(latitudeOne) *
      Math.cos(latitudeTwo) *
      Math.sin(longitudeDelta / 2) ** 2;

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const buildMapEmbedUrl = (query = "") =>
  `https://maps.google.com/maps?q=${encodeURIComponent(
    String(query).trim()
  )}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

export {
  buildMapEmbedUrl,
  haversineDistanceKm,
  normalizeText,
  resolveLocationToCoordinates,
};
