import express from "express";
import {
  createTrip,
  getAllTrips,
  getTrip,
} from "../controllers/trip.controller.js";

import { auth } from "../middleware/auth.middleware.js";
import { isOrganizer } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createTripValidator } from "../validators/trip.validator.js";
const router = express.Router();

// Public
router.get("/", getAllTrips);
router.get("/:id",getTrip)
// Organizer only
router.post("/", auth, isOrganizer, createTripValidator, validate, createTrip);



export default router;
