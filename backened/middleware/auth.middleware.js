import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";
import User from "../models/user.model.js";

export const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.principalType === "admin" && decoded.adminId) {
      const admin = await Admin.findById(decoded.adminId).select(
        "name email phone permissions isActive"
      );

      if (!admin || !admin.isActive) {
        return res.status(401).json({ message: "Session is no longer valid." });
      }

      req.user = {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        permissions: admin.permissions,
        role: "Admin",
      };
      return next();
    }

    const user = await User.findById(decoded.userId).select(
      "name email phone role isVerified"
    );

    if (!user) {
      return res.status(401).json({ message: "Session is no longer valid." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ message: "Unauthorized." });
  }
};

export const requireAdmin = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.adminId).select(
      "name email phone permissions isActive"
    );

    if (
      decoded.principalType !== "admin" ||
      !admin ||
      !admin.isActive
    ) {
      return res.status(401).json({ message: "Session is no longer valid." });
    }

    req.user = {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
      permissions: admin.permissions,
      role: "Admin",
    };
    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    res.status(403).json({ message: "Admin access only." });
  }
};
