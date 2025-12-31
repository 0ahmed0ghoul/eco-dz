import { Router } from "express";
import * as agencyController from "../controllers/agency.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

// Agency role management
router.post("/switch-to-agency", authMiddleware, agencyController.switchToAgency);
router.get("/profile", authMiddleware, agencyController.getUserProfile);

// Trip management (agency only)
router.post("/trips", authMiddleware, agencyController.createTrip);
router.get("/trips", agencyController.getAllTrips);
router.get("/trips/:tripId", agencyController.getTrip);
router.get("/agency/:agencyId/trips", agencyController.getTripsByAgency);

// Favorites management
router.post("/favorites", authMiddleware, agencyController.addFavoriteAgency);
router.delete("/favorites/:agencyId", authMiddleware, agencyController.removeFavoriteAgency);
router.get("/favorites", authMiddleware, agencyController.getUserFavorites);

// Email subscriptions
router.post("/subscriptions/toggle", authMiddleware, agencyController.toggleEmailSubscription);
router.get("/subscriptions", authMiddleware, agencyController.getUserSubscriptions);
router.patch("/unsubscribe/:token", agencyController.unsubscribeFromEmails);

export default router;
