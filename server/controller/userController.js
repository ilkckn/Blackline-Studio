import User from "../models/user.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { CustomError } from "../utils/errorHandler.js";

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");

  if (!user) {
    throw new CustomError("User not found", 404);
  }

  res.status(200).json({ user });
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");

  res.status(200).json({ users });
});

export const getUserById = asyncHandler(async (req, res) => {
  if (!req.user.role.includes("admin") && req.user.id !== req.params.id) {
    throw new CustomError("You are not authorized to view this user", 403);
  }

  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    throw new CustomError("User not found", 404);
  }

  res.status(200).json({ user });
});

export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, userName, email, phone } = req.body;

  if (req.user.id !== id) {
    throw new CustomError("You are not authorized to update this user", 403);
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, userName, email, phone },
      { new: true, runValidators: true },
    ).select("-password");

    if (!updatedUser) {
      throw new CustomError("User not found", 404);
    }

    res
      .status(200)
      .json({ updatedUser, message: "Profile updated successfully" });
  } catch (error) {
    if (error.code === 11000) {
      throw new CustomError("Email already in use", 400);
    }
    if (error.name === "CastError") {
      throw new CustomError("Invalid user id", 400);
    }
    if (error.name === "ValidationError") {
      throw new CustomError(error.message, 400);
    }
    throw error;
  }
});

export const deactivateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (req.user.id !== id && !req.user.role.includes("admin")) {
    throw new CustomError(
      "You are not authorized to deactivate this user",
      403,
    );
  }

  const user = await User.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true },
  ).select("-password");

  if (!user) {
    throw new CustomError("User not found", 404);
  }

  res
    .status(200)
    .json({ user, message: "Account deactivated. We're sorry to see you go!" });
});

export const reactivateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (req.user.id !== id && !req.user.role.includes("admin")) {
    throw new CustomError(
      "You are not authorized to reactivate this user",
      403,
    );
  }

  const user = await User.findByIdAndUpdate(
    id,
    { isActive: true },
    { new: true },
  ).select("-password");

  if (!user) {
    throw new CustomError("User not found", 404);
  }

  res.status(200).json({ user, message: "Account reactivated." });
});

const ALLOWED_ROLES = ["user", "admin", "artist"];

export const updateUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!role) {
    throw new CustomError("Please provide a role", 400);
  }

  // Tek yazı da gelse dizi de gelse diziye çeviriyoruz
  const roles = Array.isArray(role) ? role : [role];

  // Gelen rollerin HEPSİ izin verilen listede olmalı
  if (roles.length === 0 || !roles.every((item) => ALLOWED_ROLES.includes(item))) {
    throw new CustomError(
      `Invalid role. Allowed roles: ${ALLOWED_ROLES.join(", ")}`,
      400,
    );
  }

  // Admin kendi rolünü yanlışlıkla düşürmesin
  if (req.user.id === id) {
    throw new CustomError("You cannot change your own role", 403);
  }

  // "user" her hesapta kalsın, tekrar edenleri ele
  const finalRoles = [...new Set(["user", ...roles])];

  const user = await User.findByIdAndUpdate(
    id,
    { role: finalRoles },
    { new: true, runValidators: true },
  ).select("-password");

  if (!user) {
    throw new CustomError("User not found", 404);
  }

  res.status(200).json({ user, message: "User role updated successfully" });
});
