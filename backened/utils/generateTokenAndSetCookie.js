// utils/generateTokenAndSetCookie.js
import jwt from "jsonwebtoken";

/**
 * Generates a JWT token and sets it as an HTTP-only cookie.
 * @param {Object} res - Express response object
 * @param {string} userId - MongoDB user ID
 * @param {Object} [options] - Optional settings
 * @param {string} [options.expiresIn="7d"] - JWT expiration
 * @param {number} [options.cookieMaxAge=7*24*60*60*1000] - Cookie max age in ms
 * @returns {string} JWT token
 */
const generateTokenAndSetCookie = (res, userId, options = {}) => {
  if (!res || !userId) {
    throw new Error("Response object and userId are required to generate token.");
  }

  const expiresIn = options.expiresIn || "7d";
  const cookieMaxAge = options.cookieMaxAge || 7 * 24 * 60 * 60 * 1000; // 7 days

  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: cookieMaxAge,
  });

  return token;
};

export default generateTokenAndSetCookie;