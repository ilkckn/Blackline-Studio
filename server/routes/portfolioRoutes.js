import { Router } from "express";
import { auth } from "../middlewares/authMiddleware.js";
import {
  getArtistPortfolio,
  addPortfolioItem,
  deletePortfolioItem,
  getAllPortfolio,
} from "../controller/portfolioController.js";

const router = Router();

router.get("/artist-portfolio/:id", getArtistPortfolio);
router.post("/add-item", auth, addPortfolioItem);
router.delete("/delete-item/:id", auth, deletePortfolioItem);
router.get("/all-items", getAllPortfolio);

export default router;