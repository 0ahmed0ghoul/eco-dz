import express from "express";
import {
  getCategories,
  getPlacesByCategory,
  getPlaceBySlug,
  getAllPlacess,
} from "../controllers/place.controller.js";

const router = express.Router();

router.get("/", getAllPlacess);

// 1️⃣ Get all categories
router.get("/categories", getCategories);

// 3️⃣ Get single place by category & slug
router.get("/:category/:slug", getPlaceBySlug);

// 2️⃣ Get all places by category
router.get("/:category", getPlacesByCategory);



export default router;
