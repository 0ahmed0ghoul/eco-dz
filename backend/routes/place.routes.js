import express from "express";
import {
  getCategories,
  getPlacesByCategory,
  getPlaceBySlug,
  getAllPlacess,
  getPlaceLikes,
  toggleLike,
  ratePlace,
  getPlaceReviews,
  addPlaceReview,
} from "../controllers/place.controller.js";
import { auth, authOptional } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAllPlacess);
router.get("/:id/likes", authOptional, getPlaceLikes);
router.post("/:id/like", auth, toggleLike);
router.post("/:id/rate", auth, ratePlace);

import { upload } from "../middleware/upload.js";
router.get("/:id/reviews", getPlaceReviews);

router.post("/:id/reviews", auth, upload.single("image"), addPlaceReview);

// 1️⃣ Get all categories
router.get("/categories", getCategories);

// 3️⃣ Get single place by category & slug
router.get("/:category/:slug", getPlaceBySlug);

// 2️⃣ Get all places by category
router.get("/:category", getPlacesByCategory);



export default router;
