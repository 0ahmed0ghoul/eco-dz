import { Router } from "express";
import * as c from "../controllers/accommodations.controller.js";

const router = Router();

router.get("/", c.getAll);

export default router;
