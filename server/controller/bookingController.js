import Booking from "../models/booking.js";
import Artist from "../models/artist.js";
import Review from "../models/reviews.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { CustomError } from "../utils/errorHandler.js";

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;
const DAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const STATUS_TRANSITIONS = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

export const createBooking = asyncHandler(async (req, res) => {
  const { artist, date, startTime, endTime, description } = req.body;

  if (!artist || !date || !startTime || !endTime) {
    throw new CustomError(
      "Please provide artist, date, start and end time",
      400,
    );
  }

  if (
    !DATE_REGEX.test(date) ||
    !TIME_REGEX.test(startTime) ||
    !TIME_REGEX.test(endTime)
  ) {
    throw new CustomError(
      "Date must be YYYY-MM-DD and times must be HH:MM",
      400,
    );
  }

  const bookingDate = new Date(`${date}T00:00:00Z`);

  if (isNaN(bookingDate) || bookingDate.toISOString().slice(0, 10) !== date) {
    throw new CustomError("Invalid date", 400);
  }

  const today = new Date().toISOString().slice(0, 10);

  if (date < today) {
    throw new CustomError("You cannot book a date in the past", 400);
  }

  if (endTime <= startTime) {
    throw new CustomError("End time must be after start time", 400);
  }

  const foundArtist = await Artist.findOne({ _id: artist, isActive: true });

  if (!foundArtist) {
    throw new CustomError("Artist not found", 404);
  }

  const dayName = DAYS[bookingDate.getUTCDay()];

  if (!foundArtist.workingDays.includes(dayName)) {
    throw new CustomError("Artist does not work on this day", 400);
  }

  if (!foundArtist.workStartTime || !foundArtist.workEndTime) {
    throw new CustomError("Artist has no working hours set", 400);
  }

  if (
    startTime < foundArtist.workStartTime ||
    endTime > foundArtist.workEndTime
  ) {
    throw new CustomError(
      `Artist works between ${foundArtist.workStartTime} and ${foundArtist.workEndTime}`,
      400,
    );
  }

  const conflict = await Booking.findOne({
    artist,
    date,
    status: { $ne: "cancelled" },
    startTime: { $lt: endTime },
    endTime: { $gt: startTime },
  });

  if (conflict) {
    throw new CustomError("This time slot is already booked", 400);
  }

  const booking = await Booking.create({
    user: req.user.id,
    artist,
    date,
    startTime,
    endTime,
    description,
  });

  res.status(201).json({ booking, message: "Booking created successfully" });
});

export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user.id })
    .populate({
      path: "artist",
      select: "specialties profileImage user",
      populate: { path: "user", select: "name userName" },
    })
    .sort({ date: 1, startTime: 1 })
    .lean();

  const reviews = await Review.find({
    booking: { $in: bookings.map((booking) => booking._id) },
  }).select("booking");

  const reviewedIds = new Set(
    reviews.map((review) => review.booking.toString()),
  );

  const result = bookings.map((booking) => ({
    ...booking,
    hasReview: reviewedIds.has(booking._id.toString()),
  }));

  res.status(200).json({ bookings: result });
});

export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!Object.keys(STATUS_TRANSITIONS).includes(status)) {
    throw new CustomError(
      "Status must be pending, confirmed, completed or cancelled",
      400,
    );
  }

  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw new CustomError("Booking not found", 404);
  }

  const artist = await Artist.findById(booking.artist);

  const isAdmin = req.user.role.includes("admin");
  const isArtistOwner = artist && artist.user.toString() === req.user.id;
  const isCustomer = booking.user.toString() === req.user.id;

  if (!isAdmin && !isArtistOwner && !isCustomer) {
    throw new CustomError("You are not authorized to update this booking", 403);
  }

  if (!isAdmin && !isArtistOwner && status !== "cancelled") {
    throw new CustomError("You can only cancel your own booking", 403);
  }

  if (!STATUS_TRANSITIONS[booking.status].includes(status)) {
    throw new CustomError(
      `Cannot change status from ${booking.status} to ${status}`,
      400,
    );
  }

  booking.status = status;
  await booking.save();

  res.status(200).json({ booking, message: "Booking status updated" });
});

export const getAllBookings = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.status) {
    filter.status = req.query.status;
  }

  const bookings = await Booking.find(filter)
    .populate("user", "name userName email phone")
    .populate({
      path: "artist",
      select: "specialties profileImage user",
      populate: { path: "user", select: "name userName" },
    })
    .sort({ date: 1, startTime: 1 });

  res.status(200).json({ bookings });
});

export const getArtistBookings = asyncHandler(async (req, res) => {
  const artist = await Artist.findById(req.params.id);

  if (!artist) {
    throw new CustomError("Artist not found", 404);
  }

  const isOwner = artist.user.toString() === req.user.id;
  const isAdmin = req.user.role.includes("admin");

  if (!isOwner && !isAdmin) {
    throw new CustomError("You are not authorized to view these bookings", 403);
  }

  const bookings = await Booking.find({ artist: artist._id })
    .populate("user", "name userName phone")
    .sort({ date: 1, startTime: 1 });

  res.status(200).json({ bookings });
});
