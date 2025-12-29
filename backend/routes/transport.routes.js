import { Router } from "express";
import c from "../controllers/transport.controller.js";

const router = Router();

router.get("/", c.getAll);

export default router;
