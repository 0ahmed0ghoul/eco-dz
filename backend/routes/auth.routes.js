import express from "express";
import { register, login, completeProfile, getMe } from "../controllers/auth.controller.js";
import { registerValidator, loginValidator, completeProfileValidator } from "../validators/auth.validator.js";
import { validate } from "../middleware/validate.middleware.js";
import { authLimiter } from "../middleware/rateLimit.middleware.js";
import { auth } from "../middleware/auth.middleware.js";
const router = express.Router();


router.post("/register", registerValidator, validate, register);
router.post("/login", authLimiter, loginValidator, validate, login);
router.post('/user/:id/complete-profile',completeProfileValidator, completeProfile , validate);

router.get('/me',auth,getMe);
  
export default router;
