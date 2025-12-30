import { Router } from "express";
import { getAll } from "../controllers/accommodations.controller.js";

const router = Router();

router.get("/", getAll);

export default router;
