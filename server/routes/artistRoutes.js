import { Router } from "express";
import { auth, admin } from "../middlewares/authMiddleware.js";
import { createArtistProfile, getAllArtists, getArtistById, updateArtist } from "../controller/artistController.js";

const router = Router();

router.post("/create-profile", auth, createArtistProfile);
router.get("/all-artists", getAllArtists);
router.get("/artist/:id", getArtistById);
router.put("/update-profile/:id", auth, updateArtist);

export default router;