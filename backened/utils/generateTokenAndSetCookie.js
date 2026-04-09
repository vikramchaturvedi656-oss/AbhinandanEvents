// utils/generateTokenAndSetCookie.js
import jwt from "jsonwebtoken";

/**
 * Generates a JWT token and sets it as an HTTP-only cookie.
 * @param {Object} res - Express response object
 * @param {string|Object} subject - MongoDB user ID or a token payload object
 * @param {Object} [options] - Optional settings
 * @param {string} [options.expiresIn="7d"] - JWT expiration
 * @param {number} [options.cookieMaxAge=7*24*60*60*1000] - Cookie max age in ms
 * @returns {string} JWT token
 */
const generateTokenAndSetCookie = (res, subject, options = {}) => {
  if (!res || !subject) {
    throw new Error("Response object and token subject are required to generate token.");
  }

  const expiresIn = options.expiresIn || "7d";
  const cookieMaxAge = options.cookieMaxAge || 7 * 24 * 60 * 60 * 1000; // 7 days

  const payload =
    typeof subject === "object" ? { ...subject } : { userId: subject };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: cookieMaxAge,
  });

  return token;
};

export default generateTokenAndSetCookie;
