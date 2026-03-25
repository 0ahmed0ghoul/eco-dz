import express from "express";
import {
  getFavorites,
  getRatings,
  deleteFavorite,
  deleteRating,
  GetPlaceDetails,
  searchForUser,
  getReviews,
  deleteReview,
  updateUserProfilePicture,
  updatePlaceReview,
  getReviewReactions,
  reactToReview,
  addReply,
  cleamAchievement,
  sendFollowConfirmationEmail
} from "../controllers/user.controller.js";

import { auth, authorize } from "../middleware/auth.middleware.js";
import  uploadAvatar  from "../middleware/upload/avatar.js";
import { uploadReview } from "../middleware/upload/reviews.js";

const router = express.Router();


router.get("/favorites", auth, getFavorites);
router.delete('/favorites', auth , deleteFavorite );

router.get("/ratings", auth, getRatings);
router.delete('/ratings/:id', auth, deleteRating);

router.get('/search', auth , searchForUser );
router.post('/email/follow-confirmation', auth , sendFollowConfirmationEmail );

router.get('/reviews', auth, getReviews );
router.put('/review/:id', auth,uploadReview.array("images", 5), updatePlaceReview );
router.get('/review/:reviewId/reactions',getReviewReactions );
router.post('/review/:reviewId/react', auth,reactToReview );
router.post('/review/:reviewId/reply', auth,addReply );

router.post('/achievements/claim', auth,cleamAchievement);

router.delete('/reviews/:id', auth, deleteReview);




// Get place details (for multiple places)
router.post('/places/details', GetPlaceDetails);

router.post(
  "/avatar",
  auth,
  authorize("traveller"),
  uploadAvatar.single("avatar"),
  async (req, res) => {
    try {
      await pool.query(
        "UPDATE users SET avatar = ? WHERE id = ?",
        [req.file.filename, req.user.id]
      );

      res.json({
        message: "Avatar uploaded successfully",
        avatar: req.file.filename,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Avatar upload failed" });
    }
  }
);

router.post("/upload-profile-picture",auth, uploadAvatar.single('image'), updateUserProfilePicture )



export default router;
