import { Router } from "express";
import { cancelBooking, checkInBooking, confirmBooking, createBooking, createDealBooking, getUserBookings } from "../controllers/booking.controller.js";
import { auth,  } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/create",auth, createBooking);
router.post("/deals/create", auth, createDealBooking);

router.get("/cancel",auth, cancelBooking);
router.get("/getUserBookings",auth, getUserBookings);

router.post("/confirm",auth, confirmBooking); // confirm a pending booking
router.post("/check-in",auth, checkInBooking); // mark user as attended

export default router;
