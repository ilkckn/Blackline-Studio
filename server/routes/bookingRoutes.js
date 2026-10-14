import { Router } from "express";
import { auth } from "../middlewares/authMiddleware.js";
import { createBooking, getMyBookings, updateBookingStatus, getAllBookings, getArtistBookings } from "../controller/bookingController.js";

const router = Router();

router.post("/create-booking", auth, createBooking);
router.get("/my-bookings", auth, getMyBookings);
router.get("/all-bookings", auth, getAllBookings);
router.get("/artist-bookings/:id", auth, getArtistBookings);
router.put("/update-booking-status/:id/status", auth, updateBookingStatus);

export default router;