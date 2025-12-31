import express from "express";
import { agencyLogin, getAgencyDashboard } from "../controllers/agency.controller.js";
import { protectAgency } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/login", agencyLogin);
router.get("/dashboard", protectAgency, getAgencyDashboard);

export default router;
