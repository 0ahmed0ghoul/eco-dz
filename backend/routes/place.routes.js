import express from "express";
import {
  getCategories,
  getPlacesByCategory,
  getPlaceBySlug,
} from "../controllers/place.controller.js";

const router = express.Router();

// 1️⃣ Get all categories
router.get("/categories", getCategories);

// 2️⃣ Get all places by category
router.get("/:category", getPlacesByCategory);

// 3️⃣ Get single place by category & slug
router.get("/:category/:slug", getPlaceBySlug);

export default router;
