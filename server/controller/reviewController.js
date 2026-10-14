import Review from "../models/reviews.js";
import Booking from "../models/booking.js";
import Artist from "../models/artist.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { CustomError } from "../utils/errorHandler.js";

export const createReview = asyncHandler(async (req, res) => {
  const { bookingId, rating, comment } = req.body;

  if (!bookingId || !rating || !comment) {
    throw new CustomError("Please provide bookingId, rating and comment", 400);
  }

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new CustomError("Booking not found", 404);
  }

  if (booking.user.toString() !== req.user.id) {
    throw new CustomError("You are not authorized to review this booking", 403);
  }

  const status = booking.status;
  if (status !== "completed") {
    throw new CustomError("You can only review completed bookings", 400);
  }

  const existingReview = await Review.findOne({ booking: bookingId });
  if (existingReview) {
    throw new CustomError("You have already reviewed this booking", 400);
  }

  const review = await Review.create({
    user: req.user.id,
    artist: booking.artist._id,
    booking: bookingId,
    rating,
    comment,
  });

  res.status(201).json({
    review: {
      id: review._id,
      user: review.user,
      artist: review.artist,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
    },
    message: "Review created successfully",
  });
});

export const getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find()
    .populate("user", "name userName")
    .populate({
      path: "artist",
      select: "user",
      populate: { path: "user", select: "name userName" },
    })
    .sort({ createdAt: -1 });

  res.status(200).json({ reviews });
});

export const getLatestReviews = asyncHandler(async (req, res) => {
  const limit = Math.min(Math.max(Math.floor(Number(req.query.limit)) || 6, 1), 20);

  const reviews = await Review.find()
    .select("user artist rating comment createdAt")
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("user", "name userName")
    .populate({
      path: "artist",
      select: "user",
      populate: { path: "user", select: "name userName" },
    });

  res.status(200).json({ reviews });
});

export const getArtistReviews = asyncHandler(async (req, res) => {
  const artist = await Artist.findById(req.params.id);

  if (!artist) {
    throw new CustomError("Artist not found", 404);
  }

  const reviews = await Review.find({ artist: artist._id })
    .populate("user", "name userName")
    .sort({ createdAt: -1 });

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews === 0
      ? 0
      : Math.round(
          (reviews.reduce((sum, review) => sum + review.rating, 0) /
            totalReviews) *
            10,
        ) / 10;

  res.status(200).json({ averageRating, totalReviews, reviews });
});

export const deleteReviews = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    throw new CustomError("Review not found", 404);
  }

  const isOwner = review.user.toString() === req.user.id;
  const isAdmin = req.user.role.includes("admin");

  if (!isOwner && !isAdmin) {
    throw new CustomError("You are not authorized to delete this review", 403);
  }

  await review.deleteOne();

  res.status(200).json({ message: "Review deleted successfully" });
});
