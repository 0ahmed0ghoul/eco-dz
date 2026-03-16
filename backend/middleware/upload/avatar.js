import multer from "multer";
import path from "path";

const avatarStorage = multer.diskStorage({
  destination: "uploads/avatars",
  filename: (req, file, cb) => {
    cb(
      null,
      `avatar_${req.user.id}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

export const uploadAvatar = multer({ storage: avatarStorage }); // <-- fixed
