import { Router } from "express";
import { getAllMonuments } from "../controllers/monuments.controller.js";

const router = Router();

router.get("/", getAllMonuments);

export default router;
