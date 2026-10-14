import User from "../models/user.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { CustomError } from "../utils/errorHandler.js";
import bcrypt from "bcrypt";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, userName, email, phone, password } = req.body;

  if (!name || !userName || !email || !password) {
    throw new CustomError("Please provide all required fields", 400);
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new CustomError("User already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    userName,
    email,
    phone,
    password: hashedPassword,
  });

  generateTokenAndSetCookie(res, newUser);

  res.status(201).json({
    user: {
      id: newUser.id,
      name: newUser.name,
      userName: newUser.userName,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
    },
    message: "You have successfully created an account!",
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new CustomError("Please provide both current and new passwords", 400);
  }

  if (req.user.id !== id) {
    throw new CustomError(
      "You are not authorized to change this password",
      403,
    );
  }

  const user = await User.findById(id);

  if (!user) {
    throw new CustomError("User not found", 404);
  }

  const isMatchingPAssword = await bcrypt.compare(
    currentPassword,
    user.password,
  );

  if (!isMatchingPAssword) {
    throw new CustomError("Current password is incorrect", 401);
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res
    .status(200)
    .json({ message: "You have successfully changed your password!" });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError("Please provide both email and password", 400);
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError("Invalid email or password", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new CustomError("Invalid email or password", 401);
  }

  if (!user.isActive) {
    throw new CustomError(
      "Your account is inactive. Please contact support.",
      403,
    );
  }

  generateTokenAndSetCookie(res, user);

  res.status(200).json({
    user: {
      id: user.id,
      name: user.name,
      userName: user.userName,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
    message: "You have successfully logged in!",
  });
});

export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    path: "/",
  });
  res.status(200).json({ message: "Logged out successfully" });
});
