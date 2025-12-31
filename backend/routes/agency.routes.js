import { Router } from "express";
import * as agencyController from "../controllers/agency.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = Router();

// Agency role management
router.post("/switch-to-agency", auth, upload.single('image'), agencyController.switchToAgency);
router.put("/update-profile-picture", auth, upload.single('image'), agencyController.updateProfilePicture);
router.get("/profile", auth, agencyController.getUserProfile);

// Trip management (agency only)
router.post("/trips", auth, upload.array('images', 10), agencyController.createTrip);
router.put("/trips/:tripId", auth, upload.array('images', 10), agencyController.editTrip);
router.get("/trips", agencyController.getAllTrips);
router.get("/trips/:tripId", agencyController.getTrip);
router.delete("/trips/:tripId", auth, agencyController.deleteTrip);
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
