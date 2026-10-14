import Artist from "../models/artist.js";
import User from "../models/user.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { CustomError } from "../utils/errorHandler.js";

export const createArtistProfile = asyncHandler(async (req, res) => {
  const {
    user,
    bio,
    specialties,
    workingDays,
    workStartTime,
    workEndTime,
    profileImage,
  } = req.body;

  if (!user) {
    throw new CustomError("Please provide a user ID", 400);
  }

  const foundUser = await User.findById(user);
  if (!foundUser) {
    throw new CustomError("User not found", 404);
  }

  if (!foundUser.role.includes("artist")) {
    throw new CustomError("User is not an artist", 400);
  }

  const existingArtist = await Artist.findOne({ user });
  if (existingArtist) {
    throw new CustomError("Artist profile already exists", 400);
  }

  if (workStartTime && workEndTime && workEndTime <= workStartTime) {
    throw new CustomError("Work end time must be after work start time", 400);
  }

  const artist = await Artist.create({
    user,
    bio,
    specialties,
    workingDays,
    workStartTime,
    workEndTime,
    profileImage,
  });

  res
    .status(201)
    .json({ artist, message: "Artist profile created successfully" });
});

export const getAllArtists = asyncHandler(async (req, res) => {
  const artists = await Artist.find({ isActive: true }).populate(
    "user",
    "name userName email",
  );

  if (!artists) {
    throw new CustomError("No artists found", 404);
  }

  res.status(200).json({ artists, message: "Artists retrieved successfully" });
});

export const getArtistById = asyncHandler(async (req, res) => {
  const artist = await Artist.findById({
    _id: req.params.id,
    isActive: true,
  }).populate("user", "name userName email");
  if (!artist) {
    throw new CustomError("Artist not found", 404);
  }

  res.status(200).json({ artist, message: "Artist retrieved successfully" });
});

export const updateArtist = asyncHandler(async (req, res) => {
  const artist = await Artist.findById(req.params.id);

  if (!artist) {
    throw new CustomError("Artist not found", 404);
  }

  const isOwner = artist.user.toString() === req.user.id;
  const isAdmin = req.user.role.includes("admin");

  if (!isOwner && !isAdmin) {
    throw new CustomError("You are not authorized to update this profile", 403);
  }

  const allowedFields = [
    "bio",
    "specialties",
    "workingDays",
    "workStartTime",
    "workEndTime",
    "profileImage",
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      artist[field] = req.body[field];
    }
  });

  if (isAdmin && req.body.isActive !== undefined) {
    artist.isActive = req.body.isActive;
  }

  if (
    artist.workStartTime &&
    artist.workEndTime &&
    artist.workEndTime <= artist.workStartTime
  ) {
    throw new CustomError("Work end time must be after work start time", 400);
  }

  await artist.save();

  res.status(200).json({ artist, message: "Artist profile updated" });
});
