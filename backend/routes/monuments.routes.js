import { Router } from "express";
import controller from "../controllers/monuments.controller.js";

const router = Router();

router.get("/", controller.getAllMonuments);

export default router;
