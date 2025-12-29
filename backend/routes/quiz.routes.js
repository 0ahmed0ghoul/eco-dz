import { Router } from "express";
import * as c from "../controllers/quiz.controller.js";

const router = Router();

router.get("/", c.getAll);
router.get("/:id", c.getOne);

export default router;
