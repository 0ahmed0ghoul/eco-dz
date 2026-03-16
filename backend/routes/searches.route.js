import { Router } from "express";
import { createSearch, getRecentSearches } from "../controllers/search.controller.js";
const router = Router();


router.post("/", createSearch);
router.get("/recent",getRecentSearches)



export default router;