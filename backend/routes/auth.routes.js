import express from "express";
import { completeProfile, getMe, agencyRegister, travellerRegister, travellerLogin, agencyLogin } from "../controllers/auth.controller.js";
import {completeProfileValidator } from "../validators/auth.validator.js";
import { validate } from "../middleware/validate.middleware.js";

import { authLimiter } from "../middleware/rateLimit.middleware.js";
import { auth, authorize } from "../middleware/auth.middleware.js";
import { agencyRegisterValidator, travellerRegisterValidator } from "../validators/register.validator.js";
import { getAgencyDashboard } from "../controllers/agency.controller.js";
const router = express.Router();


router.post("/traveller/register", travellerRegisterValidator, validate, travellerRegister);
router.post("/agency/register", agencyRegisterValidator, validate, agencyRegister);

router.post("/traveller/login",authLimiter, travellerLogin);
router.post("/agency/login" ,authLimiter, agencyLogin);

router.post('/user/:id/complete-profile',completeProfileValidator, completeProfile , validate);


router.get('/me',auth,getMe);
router.get("/agency/dashboard",auth,authorize("agency"),getAgencyDashboard);
    
export default router;
