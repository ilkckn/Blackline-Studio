import Portfolio from "../models/portfolio.js";
import Artist from "../models/artist.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { CustomError } from "../utils/errorHandler.js";

export const getArtistPortfolio = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const artist = await Artist.findById(id);

  if (!artist) {
    throw new CustomError("Artist not found", 404);
  }

  const items = await Portfolio.find({ artist: artist._id }).sort({
    createdAt: -1,
  });

  res.status(200).json({ items });
});

export const addPortfolioItem = asyncHandler(async (req, res) => {
  const { artistId, imageUrl, title, style } = req.body;

  if (!imageUrl) {
    throw new CustomError("Please provide an image URL", 400);
  }

  const isAdmin = req.user.role.includes("admin");
  let artist;

  if (isAdmin) {
    if (!artistId) {
      throw new CustomError("Please provide an artistId", 400);
    }
    artist = await Artist.findById(artistId);
  } else {
    artist = await Artist.findOne({ user: req.user.id });
  }

  if (!artist) {
    throw new CustomError("Artist profile not found", 404);
  }

  const item = await Portfolio.create({
    artist: artist._id,
    imageUrl,
    title,
    style,
  });

  res.status(201).json({ item, message: "Portfolio item added" });
});

export const deletePortfolioItem = asyncHandler(async (req, res) => {
  const item = await Portfolio.findById(req.params.id);

  if (!item) {
    throw new CustomError("Portfolio item not found", 404);
  }

  const artist = await Artist.findById(item.artist);

  const isOwner = artist && artist.user.toString() === req.user.id;
  const isAdmin = req.user.role.includes("admin");

  if (!isOwner && !isAdmin) {
    throw new CustomError("You are not authorized to delete this item", 403);
  }

  await item.deleteOne();

  res.status(200).json({ message: "Portfolio item deleted" });
});

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const getAllPortfolio = asyncHandler(async (req, res) => {
  const { style } = req.query;
  const limit = Math.min(Math.max(Math.floor(Number(req.query.limit)) || 24, 1), 60);
  const page = Math.max(Math.floor(Number(req.query.page)) || 1, 1);

  // Sadece aktif artist'lerin işleri herkese açık galeride görünsün
  const activeArtists = await Artist.find({ isActive: true }).select("_id");

  const filter = { artist: { $in: activeArtists.map((artist) => artist._id) } };

  // Stil filtresi: büyük/küçük harfe bakmaz, sadece yazı kabul eder
  if (typeof style === "string" && style.trim()) {
    filter.style = new RegExp(`^${escapeRegex(style.trim())}$`, "i");
  }

  const total = await Portfolio.countDocuments(filter);

  const items = await Portfolio.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate({
      path: "artist",
      select: "user",
      populate: { path: "user", select: "name userName" },
    });

  res.status(200).json({ items, total, page, pages: Math.ceil(total / limit) });
});