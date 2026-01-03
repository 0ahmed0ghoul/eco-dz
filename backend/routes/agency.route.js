import express from "express";
import { addAgencyDashboardDeals, addAgencyDashboardhighlights, addAgencyDashboardTrips, deleteAgencyDeal, deleteAgencyhighlights, deleteAgencyTrip, getAgencyDashboard, getAgencyDashboardDeals, getAgencyDashboardhighlights, getAgencyDashboardTrips, updateAgencyDeal, updateAgencyhighlights, updateAgencyTrip } from "../controllers/agency.controller.js";
import { protectAgency } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/trips",protectAgency, getAgencyDashboardTrips);
router.post("/trips",protectAgency, addAgencyDashboardTrips);
router.put("/trips/:id", protectAgency, updateAgencyTrip);
router.delete("/trips/:id", protectAgency, deleteAgencyTrip);

router.get("/deals", protectAgency, getAgencyDashboardDeals);
router.post("/deals", protectAgency, addAgencyDashboardDeals);
router.put("/deals/:id", protectAgency, updateAgencyDeal);
router.delete("/deals/:id", protectAgency, deleteAgencyDeal);

router.get("/highlights",protectAgency, getAgencyDashboardhighlights);
router.post("/highlights",protectAgency, addAgencyDashboardhighlights);
router.put("/highlights/:id", protectAgency, updateAgencyhighlights);
router.delete("/highlights/:id", protectAgency, deleteAgencyhighlights);

export default router;
