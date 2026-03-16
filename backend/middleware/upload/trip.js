import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure folder exists
const tripUploadDir = "uploads/trips";
if (!fs.existsSync(tripUploadDir)) fs.mkdirSync(tripUploadDir, { recursive: true });

const tripStorage = multer.diskStorage({
  destination: tripUploadDir,
  filename: (req, file, cb) => {
    cb(
      null,
      `trip_${req.user.id}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

export const uploadTrip = multer({ storage: tripStorage });
