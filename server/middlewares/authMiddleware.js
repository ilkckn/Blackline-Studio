import User from "../models/user.js";
import { CustomError } from "../utils/errorHandler.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

export const auth = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    throw new CustomError("Not authorized, token missing", 401);
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new CustomError("Session expired, please login again", 401);
    }
    throw new CustomError("Invalid token", 401);
  }

  const user = await User.findById(decoded.id).select("-password");

  if (!user) {
    throw new CustomError("User not found", 401);
  }

  if (!user.isActive) {
    throw new CustomError("Your account is inactive", 403);
  }

  req.user = user;
  next();
});

export const admin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role.includes("admin")) {
    next();
  } else {
    throw new CustomError("Not authorized as an admin", 403);
  }
});
