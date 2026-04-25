import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./db/connectDB.js";
import ensureSeedData from "./utils/ensureSeedData.js";
import ensureAdminAccounts from "./utils/ensureAdminAccounts.js";
import authRoutes from "./routes/auth.route.js";
import eventRoutes from "./routes/event.route.js";
import plannerRoutes from "./routes/planner.route.js";
import bookingRoutes from "./routes/booking.route.js";
import adminRoutes from "./routes/admin.route.js";
import eventRequestRoutes from "./routes/eventRequest.route.js";

dotenv.config();

const app = express();
app.set("trust proxy", 1);

const defaultAllowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://abhinandan-events.vercel.app",
];

const configuredOrigins = [process.env.CLIENT_URL, process.env.CLIENT_URLS]
  .filter(Boolean)
  .flatMap((value) => value.split(","))
  .map((value) => value.trim())
  .filter(Boolean);

const allowedOrigins = [...new Set([...defaultAllowedOrigins, ...configuredOrigins])];

// Middleware
app.use(express.json({ limit: "6mb" }));
app.use(express.urlencoded({ extended: true, limit: "6mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origin ${origin} is not allowed by CORS.`));
    },
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/planners", plannerRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/event-requests", eventRequestRoutes);
app.use("/api/admin", adminRoutes);
app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || "Server Error"
  });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5001;

connectDB()
  .then(() => {
    console.log("Connected to MongoDB");
    return ensureSeedData();
  })
  .then(() => {
    console.log("Planner seed ready");
    return ensureAdminAccounts();
  })
  .then(() => {
    console.log("Admin whitelist ready");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
