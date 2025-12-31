import { Router } from "express";
import { getAll } from "../controllers/dealDestinations.controller.js";

const router = Router();

router.get("/", getAll);

export default router;
