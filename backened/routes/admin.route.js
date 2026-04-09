import express from "express";
import bcrypt from "bcryptjs";
import Admin from "../models/admin.model.js";
import Booking from "../models/booking.model.js";
import EventRequest from "../models/eventRequest.model.js";
import Planner from "../models/planner.model.js";
import User from "../models/user.model.js";
import { requireAdmin } from "../middleware/auth.middleware.js";
import { findBookingConflicts } from "../utils/booking.utils.js";

const router = express.Router();

router.get("/overview", requireAdmin, async (_req, res) => {
  try {
    const [bookings, planners, totalUsers, totalAdmins, eventRequests, admins] = await Promise.all([
      Booking.find().populate("plannerId").sort({ startDateTime: 1 }),
      Planner.find().sort({ rating: -1, name: 1 }),
      User.countDocuments(),
      Admin.countDocuments(),
      EventRequest.find().sort({ createdAt: -1 }),
      Admin.find().select("name email phone permissions isActive createdAt").sort({ createdAt: 1 }),
    ]);

    const conflictIds = findBookingConflicts(bookings);

    const stats = {
      totalUsers,
      totalAdmins,
      totalPlanners: planners.length,
      totalBookings: bookings.length,
      totalEventRequests: eventRequests.length,
      confirmedBookings: bookings.filter((booking) => booking.status === "Confirmed")
        .length,
      pendingBookings: bookings.filter((booking) => booking.status === "Pending")
        .length,
      cancelledBookings: bookings.filter((booking) => booking.status === "Cancelled")
        .length,
      pendingEventRequests: eventRequests.filter(
        (request) => request.status === "Pending"
      ).length,
      totalConflicts: conflictIds.size,
    };

    const bookingRows = bookings.map((booking) => ({
      ...booking.toObject(),
      hasConflict: conflictIds.has(String(booking._id)),
    }));

    res.json({
      stats,
      admins,
      planners,
      bookings: bookingRows,
      eventRequests,
    });
  } catch (error) {
    console.error("Admin overview error:", error);
    res.status(500).json({ message: "Unable to load admin overview right now." });
  }
});

router.post("/admins", requireAdmin, async (req, res) => {
  try {
    const { name, email, phone, password, permissions = [] } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "Name, email, phone, and password are required." });
    }

    if (String(password).length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const [existingAdmin, existingUser] = await Promise.all([
      Admin.findOne({ email: normalizedEmail }),
      User.findOne({ email: normalizedEmail }),
    ]);

    if (existingAdmin || existingUser) {
      return res.status(409).json({ message: "That email is already being used by another account." });
    }

    const hashedPassword = await bcrypt.hash(String(password), 12);
    const nextPermissions = Array.isArray(permissions) && permissions.length
      ? permissions
      : ["MANAGE_USERS", "MANAGE_VENDORS", "MANAGE_ADMINS"];

    const admin = await Admin.create({
      name: String(name).trim(),
      email: normalizedEmail,
      phone: String(phone).trim(),
      password: hashedPassword,
      permissions: nextPermissions,
      isActive: true,
    });

    res.status(201).json({
      message: "Admin account created successfully.",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        permissions: admin.permissions,
        isActive: admin.isActive,
      },
    });
  } catch (error) {
    console.error("Admin create error:", error);
    res.status(500).json({ message: "Unable to create the admin account." });
  }
});

router.patch("/admins/:id/password", requireAdmin, async (req, res) => {
  try {
    const { password } = req.body;

    if (!password || String(password).length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters long." });
    }

    const admin = await Admin.findById(req.params.id).select("+password");

    if (!admin) {
      return res.status(404).json({ message: "Admin account not found." });
    }

    admin.password = await bcrypt.hash(String(password), 12);
    await admin.save();

    res.json({ message: "Admin password updated successfully." });
  } catch (error) {
    console.error("Admin password update error:", error);
    res.status(500).json({ message: "Unable to update the admin password." });
  }
});

router.patch("/event-requests/:id/status", requireAdmin, async (req, res) => {
  try {
    const { status, adminNotes = "" } = req.body;

    if (!["Pending", "Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid event request status." });
    }

    const eventRequest = await EventRequest.findById(req.params.id);

    if (!eventRequest) {
      return res.status(404).json({ message: "Event request not found." });
    }

    eventRequest.status = status;
    eventRequest.adminNotes = String(adminNotes).trim();
    await eventRequest.save();

    if (eventRequest.linkedBookingId) {
      const linkedBooking = await Booking.findById(eventRequest.linkedBookingId);

      if (linkedBooking) {
        if (status === "Approved") {
          linkedBooking.status = "Confirmed";
        } else if (status === "Rejected") {
          linkedBooking.status = "Cancelled";
        } else {
          linkedBooking.status = "Pending";
        }

        await linkedBooking.save();
      }
    }

    res.json({
      message: "Event request updated successfully.",
      eventRequest,
    });
  } catch (error) {
    console.error("Event request status update error:", error);
    res.status(500).json({ message: "Unable to update the event request." });
  }
});

export default router;
