import express from "express";
import {
  getFavorites,
  getRatings,
  becomeOrganizer,
  getComments,
  deleteFavorite,
  deleteComment,
  deleteRating,
  GetPlaceDetails
} from "../controllers/user.controller.js";

import { auth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/all", async (req, res) => {
  try {
    const { getUsers } = await import("../data/fileHelpers.js");
    const users = await getUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
});

router.get("/favorites", auth, getFavorites);
router.delete('/favorites', auth , deleteFavorite );

router.get("/ratings", auth, getRatings);
router.delete('/ratings/:id', auth, deleteRating);


router.get('/comments', auth, getComments );
router.delete('/comments/:id', auth, deleteComment);

// Become organizer
router.post("/become-organizer", auth, becomeOrganizer);


// Get place details (for multiple places)
router.post('/places/details', GetPlaceDetails);



// Delete comment


// Delete rating




export default router;
