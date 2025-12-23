import express from "express";
import {getAllPlaces,ratePlace,commentPlace,favoritePlace} from "../controllers/place.controller.js";
import {ratePlaceValidator,commentPlaceValidator} from "../validators/place.validator.js";
import { auth } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public
router.get("/", getAllPlaces);

// Auth required
router.post("/:id/rate", auth, ratePlaceValidator, validate, ratePlace);
router.post("/:id/comment", auth, commentPlaceValidator, validate, commentPlace);
router.post("/:id/favorite", auth, favoritePlace);

export default router;
