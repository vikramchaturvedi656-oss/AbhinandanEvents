const FALLBACK_LOCAL_API_ORIGIN = "http://localhost:5001";
const FALLBACK_PRODUCTION_API_ORIGIN = "https://abhinandanevents.onrender.com";

const defaultOrigin = import.meta.env.DEV
  ? FALLBACK_LOCAL_API_ORIGIN
  : FALLBACK_PRODUCTION_API_ORIGIN;

export const API_ORIGIN = (
  import.meta.env.VITE_API_ORIGIN || defaultOrigin
).replace(/\/+$/, "");

export const API_BASE_URL =
  (import.meta.env.VITE_API_URL || `${API_ORIGIN}/api`).replace(/\/+$/, "");
