import { Router } from "express";
<<<<<<< HEAD
import * as c from "../controllers/accommodations.controller.js";

const router = Router();

router.get("/", c.getAll);
=======
import { getAll } from "../controllers/accommodations.controller.js";

const router = Router();

router.get("/", getAll);

>>>>>>> 9f30c1c95bd3e6e31521eab5aa07080d5559dec1

export default router;
