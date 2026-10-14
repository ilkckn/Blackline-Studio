import { Router } from "express";
import { auth, admin } from "../middlewares/authMiddleware.js";
import { createReview, getAllReviews, getArtistReviews, deleteReviews, getLatestReviews } from "../controller/reviewController.js";

const router = Router();

router.post("/create-review", auth, createReview);
router.get("/all-reviews", auth, admin, getAllReviews);
router.get("/artist-reviews/:id", getArtistReviews);
router.delete("/delete-review/:id", auth, admin, deleteReviews);
router.get("/latest-reviews", getLatestReviews);

export default router;