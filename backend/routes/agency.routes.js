import { Router } from "express";
import * as agencyController from "../controllers/agency.controller.js";
import { auth } from "../middleware/auth.middleware.js";

const router = Router();

// Agency role management
router.post("/switch-to-agency", auth, agencyController.switchToAgency);
router.get("/profile", auth, agencyController.getUserProfile);

// Trip management (agency only)
router.post("/trips", auth, agencyController.createTrip);
router.get("/trips", agencyController.getAllTrips);
router.get("/trips/:tripId", agencyController.getTrip);
router.get("/agency/:agencyId/trips", agencyController.getTripsByAgency);

// Favorites management
router.post("/favorites", auth, agencyController.addFavoriteAgency);
router.delete("/favorites/:agencyId", auth, agencyController.removeFavoriteAgency);
router.get("/favorites", auth, agencyController.getUserFavorites);

// Email subscriptions
router.post("/subscriptions/toggle", auth, agencyController.toggleEmailSubscription);
router.get("/subscriptions", auth, agencyController.getUserSubscriptions);
router.patch("/unsubscribe/:token", agencyController.unsubscribeFromEmails);

export default router;
