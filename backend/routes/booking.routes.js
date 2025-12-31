import { Router } from "express";
import * as bookingController from "../controllers/booking.controller.js";
import { auth } from "../middleware/auth.middleware.js";

const router = Router();

// Booking management
router.post("/", auth, bookingController.createBooking);
router.get("/user", auth, bookingController.getUserBookings);

export default router;
