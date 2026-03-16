import multer from "multer";
import path from "path";

const logoStorage = multer.diskStorage({
  destination: "uploads/logos",
  filename: (req, file, cb) => {
    cb(
      null,
      `logo_${req.user.id}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

export const uploadLogo = multer({ storage: logoStorage }); // <-- fixed
