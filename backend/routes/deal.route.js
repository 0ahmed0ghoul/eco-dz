import { Router } from "express";
import { getAllDeals, getDeal } from "../controllers/deal.controller.js";
const router = Router();

// Public
router.get("/", getAllDeals);
router.get("/:id",getDeal)
// Organizer only
// router.post("/", auth, isOrganizer, createTripValidator, validate, createTrip);


export default router;