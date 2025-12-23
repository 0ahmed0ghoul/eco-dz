import express from "express";
import {
  getFavorites,
  getRatings,
  becomeOrganizer
} from "../controllers/user.controller.js";

import { auth } from "../middleware/auth.middleware.js";

const router = express.Router();

// User dashboard
router.get("/favorites", auth, getFavorites);
router.get("/ratings", auth, getRatings);

// Become organizer
router.post("/become-organizer", auth, becomeOrganizer);

export default router;
