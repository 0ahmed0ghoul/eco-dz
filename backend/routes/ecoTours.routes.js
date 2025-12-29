import { Router } from "express";
import * as c from "../controllers/ecoTours.controller.js";

const router = Router();

router.get("/", c.getAll);

export default router;
