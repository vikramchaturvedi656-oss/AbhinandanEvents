// controllers/auth.controller.js
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.js";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendPasswordResetSuccessEmail,
} from "../mailtrap/emails.js";

// Utility to create standardized errors
const createError = (status, message) => {
  const err = new Error(message);
  err.statusCode = status;
  return err;
};

// ------------------- SIGNUP -------------------
const signup = async (req, res, next) => {
  try {
    const { name, email, password, role = "Client" } = req.body;

    // Validate required fields
    if (!name || !email || !password) throw createError(400, "Name, email, and password are required");

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) throw createError(409, "An account with this email already exists");

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 1000 * 60 * 60 * 24, // 24 hours
    });

    // Send verification email
    await sendVerificationEmail(user.email, user.name, verificationToken);

    // Generate JWT and set cookie
    generateTokenAndSetCookie(res, user._id);

    res.status(201).json({
      message: "Signup successful. Check your email to verify your account.",
      user: { id: user._id, name: user.name, email: user.email, role: user.role, isVerified: user.isVerified },
    });
  } catch (error) {
    next(error);
  }
};

// ------------------- LOGIN -------------------
const login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) throw createError(400, "Email, password, and role are required");

    // Find user by email and role
    const user = await User.findOne({ email, role }).select("+password");
    if (!user) throw createError(404, "No account found with this email and role");

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw createError(401, "Incorrect password");

    // Generate JWT and set cookie
    generateTokenAndSetCookie(res, user._id);

    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email, role: user.role, isVerified: user.isVerified },
    });
  } catch (error) {
    next(error);
  }
};

// ------------------- LOGOUT -------------------
const logout = async (_req, res, next) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

// ------------------- EMAIL VERIFICATION -------------------
const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) throw createError(400, "Invalid or expired verification link");

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    next(error);
  }
};

// ------------------- CHECK AUTH -------------------
const checkAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) throw createError(401, "Unauthorized");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("name email role isVerified createdAt");
    if (!user) throw createError(404, "User not found");

    res.json({ user });
  } catch (error) {
    next(error);
  }
};

// ------------------- FORGOT PASSWORD -------------------
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      const resetToken = crypto.randomBytes(32).toString("hex");
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpiresAt = Date.now() + 1000 * 60 * 30; // 30 min
      await user.save();

      await sendPasswordResetEmail(user.email, user.name, resetToken);
    }

    res.json({ message: "If that email exists, reset instructions have been sent." });
  } catch (error) {
    next(error);
  }
};

// ------------------- RESET PASSWORD -------------------
const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });
    if (!user) throw createError(400, "Invalid or expired reset link");

    user.password = await bcrypt.hash(password, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    await sendPasswordResetSuccessEmail(user.email, user.name);

    res.json({ message: "Password reset successful" });
  } catch (error) {
    next(error);
  }
};

export {
  signup,
  login,
  logout,
  verifyEmail,
  checkAuth,
  forgotPassword,
  resetPassword,
};