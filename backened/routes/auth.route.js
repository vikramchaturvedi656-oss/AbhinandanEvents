import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";
import User from "../models/user.model.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import generateTokenAndSetCookie, {
  getAuthCookieOptions,
} from "../utils/generateTokenAndSetCookie.js";
import ensureAdminAccounts from "../utils/ensureAdminAccounts.js";

const router = express.Router();
const MAX_PROFILE_IMAGE_BYTES = 3 * 1024 * 1024;

const normalizeLoginRole = (value = "") => {
  const normalizedValue = String(value).trim().toLowerCase();

  if (normalizedValue === "admin") {
    return "Admin";
  }

  if (normalizedValue === "vendor") {
    return "Vendor";
  }

  if (normalizedValue === "client" || normalizedValue === "user") {
    return "Client";
  }

  return "";
};

const isBcryptHash = (value = "") => /^\$2[aby]\$\d+\$/.test(String(value));

const verifyPassword = async (plainPassword, storedPassword) => {
  if (!storedPassword) {
    return false;
  }

  if (isBcryptHash(storedPassword)) {
    return bcrypt.compare(plainPassword, storedPassword);
  }

  return String(plainPassword) === String(storedPassword);
};

const serializeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  isVerified: user.isVerified,
  createdAt: user.createdAt,
  profileImage: user.profileImage || "",
});

const serializeAdmin = (admin) => ({
  id: admin._id,
  name: admin.name,
  email: admin.email,
  phone: admin.phone,
  role: "Admin",
  permissions: admin.permissions,
  createdAt: admin.createdAt,
  profileImage: admin.profileImage || "",
});

const isValidProfileImage = (value = "") =>
  /^data:image\/(?:png|jpeg|webp);base64,/i.test(value);

router.post("/signup", async (req, res) => {
  try {
    const { name, email, phone, password, role = "Client" } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (role === "Admin") {
      return res.status(403).json({
        message:
          "Admin accounts cannot be created from signup. Only approved admin accounts can log in.",
      });
    }

    if (!["Client", "Vendor"].includes(role)) {
      return res.status(400).json({ message: "Invalid signup role selected." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      message: "User registered successfully!",
      user: serializeUser(user),
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password, role, loginType } = req.body;
    const selectedRole = normalizeLoginRole(role || loginType);

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    await ensureAdminAccounts();

    let admin = await Admin.findOne({
      email: normalizedEmail,
      isActive: true,
    }).select("+password");

    const legacyAdminUser = await User.findOne({
      email: normalizedEmail,
      role: "Admin",
    }).select("+password");

    if (!admin && legacyAdminUser) {
      admin = await Admin.findOneAndUpdate(
        { email: normalizedEmail },
        {
          name: legacyAdminUser.name,
          email: normalizedEmail,
          phone: legacyAdminUser.phone,
          password: legacyAdminUser.password,
          isActive: true,
          permissions: ["MANAGE_USERS", "MANAGE_VENDORS", "MANAGE_ADMINS"],
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      ).select("+password");
    }

    if (admin) {
      const isMatch = await verifyPassword(password, admin.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Incorrect admin password." });
      }

      if (!isBcryptHash(admin.password)) {
        admin.password = await bcrypt.hash(password, 12);
        await admin.save();
      }

      generateTokenAndSetCookie(res, {
        adminId: admin._id,
        principalType: "admin",
        role: "Admin",
      });

      return res.status(200).json({
        message: "Admin login successful.",
        user: serializeAdmin(admin),
      });
    }

    if (selectedRole === "Admin") {
      return res.status(403).json({
        message: "Admin access denied. Admin record was not found in the database.",
      });
    }

    const user = await User.findOne({
      email: normalizedEmail,
      role: selectedRole,
    }).select("+password");

    if (!user) {
      return res
        .status(404)
        .json({ message: "No account found with this email and login type." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    generateTokenAndSetCookie(res, {
      userId: user._id,
      principalType: "user",
      role: user.role,
    });

    res.status(200).json({
      message: "Login successful.",
      user: serializeUser(user),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

router.post("/logout", (_req, res) => {
  res.clearCookie("token", getAuthCookieOptions());

  res.json({ message: "Logged out successfully." });
});

router.get("/me", async (req, res) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.principalType === "admin" && decoded.adminId) {
      const admin = await Admin.findById(decoded.adminId).select(
        "name email phone permissions isActive createdAt profileImage"
      );

      if (!admin || !admin.isActive) {
        return res.status(401).json({ message: "Session is no longer valid." });
      }

      return res.json({
        user: serializeAdmin(admin),
      });
    }

    const user = await User.findById(decoded.userId).select(
      "name email phone role isVerified createdAt profileImage"
    );

    if (!user) {
      return res.status(401).json({ message: "Session is no longer valid." });
    }

    res.json({
      user: serializeUser(user),
    });
  } catch (error) {
    console.error("Auth check error:", error);
    res.status(401).json({ message: "Unauthorized." });
  }
});

router.patch("/me/profile-image", requireAuth, async (req, res) => {
  try {
    const { profileImage = "" } = req.body;

    if (profileImage && !isValidProfileImage(profileImage)) {
      return res.status(400).json({
        message: "Please upload a PNG, JPEG, or WEBP image.",
      });
    }

    if (
      profileImage &&
      Buffer.byteLength(profileImage, "utf8") > MAX_PROFILE_IMAGE_BYTES
    ) {
      return res.status(413).json({
        message: "Profile image is too large. Please upload an image under 2MB.",
      });
    }

    if (req.user.role === "Admin") {
      const admin = await Admin.findByIdAndUpdate(
        req.user.id,
        { profileImage },
        {
          new: true,
          runValidators: true,
        }
      ).select("name email phone permissions isActive createdAt profileImage");

      if (!admin || !admin.isActive) {
        return res.status(404).json({ message: "Admin account not found." });
      }

      return res.json({
        message: profileImage
          ? "Profile photo updated successfully."
          : "Profile photo removed successfully.",
        user: serializeAdmin(admin),
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id || req.user.id,
      { profileImage },
      {
        new: true,
        runValidators: true,
      }
    ).select("name email phone role isVerified createdAt profileImage");

    if (!user) {
      return res.status(404).json({ message: "User account not found." });
    }

    return res.json({
      message: profileImage
        ? "Profile photo updated successfully."
        : "Profile photo removed successfully.",
      user: serializeUser(user),
    });
  } catch (error) {
    console.error("Profile image update error:", error);
    res.status(500).json({ message: "Unable to update profile image right now." });
  }
});

export default router;
