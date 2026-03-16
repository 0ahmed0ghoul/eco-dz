import express from "express";
import { addAgencyDashboardDeals, 
  addAgencyDashboardHighlights, 
  addAgencyDashboardTrips
  , deleteAgencyDeal,
    deleteAgencyHighlight,
    deleteAgencyTrip, 
     getAgency, 
     getAgencyDashboard, 
     getAgencyDashboardDeals, 
     getAgencyDashboardHighlights
     , getAgencyDashboardTrips, 
     getAgencyDeals, 
     getAgencyProfile,
      getAgencyTripById,

       getAgencyTrips,

       updateAgencyDeal,
        updateAgencyHighlight,
        updateAgencyTrip } from "../controllers/agency.controller.js";

import { auth, authorize } from "../middleware/auth.middleware.js";
import { uploadTrip } from "../middleware/upload/trip.js";
import { uploadDeal } from "../middleware/upload/deal.js";
import { uploadHighlight } from "../middleware/upload/highlight.js";


const router = express.Router();
router.get("/profile",auth , authorize("agency"), getAgencyProfile);

router.get("/:id", getAgency);
router.get("/:id/trips", getAgencyTrips);
router.get("/:id/deals", getAgencyDeals);
// router.post("/:id/follow", followAgency);
// router.delete("/:id/follow",deleteFollow );

router.put("/deals/:id", auth , authorize("agency"),uploadDeal.array("image"), updateAgencyDeal);
router.delete("/deals/:id", auth , authorize("agency"), deleteAgencyDeal);

router.get("/trips",auth, authorize("agency"), getAgencyDashboardTrips);
router.post("/trips", auth, authorize("agency"), uploadTrip.array("images"), addAgencyDashboardTrips);
router.get("/trips/:id", auth, authorize("agency"), getAgencyTripById);
router.put("/trips/:id", auth, authorize("agency"), uploadTrip.array("images"), updateAgencyTrip);
router.delete("/trips/:id", auth, authorize("agency"), deleteAgencyTrip);

router.get("/deals" ,auth, authorize("agency"), getAgencyDashboardDeals);
router.post("/deals",auth , authorize("agency"),uploadDeal.array("image"),addAgencyDashboardDeals);

  router.put("/deals/:id", auth , authorize("agency"),uploadDeal.array("image"), updateAgencyDeal);
router.delete("/deals/:id", auth , authorize("agency"), deleteAgencyDeal);

router.get("/highlights" ,auth, authorize("agency"), getAgencyDashboardHighlights);
router.post("/highlights",auth , authorize("agency"),uploadHighlight.array("image"),addAgencyDashboardHighlights);
router.put("/highlights/:id", auth , authorize("agency"),uploadHighlight.array("image"),updateAgencyHighlight );
router.delete("/highlights/:id", auth , authorize("agency"),deleteAgencyHighlight );

export default router;
