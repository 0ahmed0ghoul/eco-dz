import express from "express";
import {
  getCategories,
  getPlacesByCategory,
  getPlaceBySlug,
  getPlaceLikes,
  toggleLike,
  ratePlace,
  getPlaceReviews,
  addPlaceReview,
  getAllPlaces,
} from "../controllers/place.controller.js";
import { auth, authOptional } from "../middleware/auth.middleware.js";
import { uploadReview } from "../middleware/upload/reviews.js";

const router = express.Router();

router.get("/", getAllPlaces);
router.get("/:id/likes", authOptional, getPlaceLikes);
router.post("/:id/like", auth, toggleLike);
router.post("/:id/rate", auth, ratePlace);

router.get("/:id/reviews", getPlaceReviews);

router.post("/:id/reviews", auth, uploadReview.array("image"), addPlaceReview);

// 1️⃣ Get all categories
router.get("/categories", getCategories);

// 3️⃣ Get single place by category & slug
router.get("/:category/:slug", getPlaceBySlug);

// 2️⃣ Get all places by category
router.get("/:category", getPlacesByCategory);



export default router;
