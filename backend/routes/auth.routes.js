import express from "express";
import { completeProfile, getMe, travellerLogin, agencyLogin, agencyCompleteProfile, registerUser, getUser } from "../controllers/auth.controller.js";
import {agencyCompleteProfileValidator, completeProfileValidator } from "../validators/auth.validator.js";
import { validate } from "../middleware/validate.middleware.js";

import { authLimiter } from "../middleware/rateLimit.middleware.js";
import { auth, authorize } from "../middleware/auth.middleware.js";
import {registerValidator } from "../validators/register.validator.js";
import { getAgencyDashboard } from "../controllers/agency.controller.js";
import uploadAvatar from "../middleware/upload/avatar.js";
import { uploadLogo } from "../middleware/upload/logo.js";
const router = express.Router();

router.post("/register", registerValidator, validate, registerUser);

router.post(
  "/user/complete-profile",
  auth,
  uploadAvatar.single("avatar"),
  completeProfileValidator,
  validate,
  completeProfile
);

  router.post(
    "/agency/complete-profile",
    auth,
    authorize("agency"),
    uploadAvatar.single("avatar"),
    agencyCompleteProfileValidator,
    validate,
    agencyCompleteProfile
  );
router.post("/traveller/login",authLimiter, travellerLogin);
router.post("/agency/login" ,authLimiter, agencyLogin);
  
  
router.get("/agency/dashboard",auth,authorize("agency"),getAgencyDashboard);

router.get('/me',auth,getMe);
router.get('/:id',getUser);

    
export default router;
