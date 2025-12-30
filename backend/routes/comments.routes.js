import { Router } from "express";
import * as controller from "../controllers/comments.controller.js";
import { auth } from "../middleware/auth.middleware.js";

const router = Router();

// Get comments (no auth needed)
router.get("/", controller.getComments);

// Create new comment (auth required)
router.post("/", auth, controller.createComment);

// Update comment (auth required)
router.put("/:id", auth, controller.updateComment);

// Delete comment (auth required)
router.delete("/:id", auth, controller.deleteComment);

// Like comment (auth required)
router.post("/:id/like", auth, controller.likeComment);

// Create reply to comment (auth required)
router.post("/:id/replies", auth, controller.createReply);

// Update reply (auth required)
router.put("/replies/:id", auth, controller.updateReply);

// Delete reply (auth required)
router.delete("/replies/:id", auth, controller.deleteReply);

// Like reply (auth required)
router.post("/replies/:id/like", auth, controller.likeReply);

export default router;
