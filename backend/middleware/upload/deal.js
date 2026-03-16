import multer from "multer";
import path from "path";

const dealStorage = multer.diskStorage({
  destination: "uploads/deals",
  filename: (req, file, cb) => {
    cb(
      null,
      `deal_${req.user.id}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

export const uploadDeal = multer({ storage: dealStorage });
