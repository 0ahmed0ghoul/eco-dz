import multer from "multer";
import path from "path";

const reviewStorage = multer.diskStorage({
  destination: "uploads/reviews",
  filename: (req, file, cb) => {
    cb(
      null,
      `review_${req.user.id}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

export const uploadReview = multer({ storage: reviewStorage });
