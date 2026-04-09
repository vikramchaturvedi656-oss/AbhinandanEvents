import axios from "axios";
import { API_BASE_URL } from "./config";

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const plannerApi = {
  list: (params) => API.get("/planners", { params }),
  getRecommendations: (params) => API.get("/planners/recommendations", { params }),
  updateAvailability: (plannerId, payload) =>
    API.patch(`/planners/${plannerId}/availability`, payload),
};

export const eventApi = {
  list: () => API.get("/events"),
  getBySlug: (slug) => API.get(`/events/${slug}`),
};

export const bookingApi = {
  checkAvailability: (payload) => API.post("/bookings/availability", payload),
  create: (payload) => API.post("/bookings", payload),
  list: (params) => API.get("/bookings", { params }),
  updateStatus: (bookingId, status) =>
    API.patch(`/bookings/${bookingId}/status`, { status }),
};

export const eventRequestApi = {
  create: (payload) => API.post("/event-requests", payload),
  previewAssignment: (payload) =>
    API.post("/event-requests/preview-assignment", payload),
};

export const adminApi = {
  getOverview: () => API.get("/admin/overview"),
  createAdmin: (payload) => API.post("/admin/admins", payload),
  updateAdminPassword: (adminId, payload) =>
    API.patch(`/admin/admins/${adminId}/password`, payload),
  updateEventRequestStatus: (requestId, payload) =>
    API.patch(`/admin/event-requests/${requestId}/status`, payload),
};

export default API;
