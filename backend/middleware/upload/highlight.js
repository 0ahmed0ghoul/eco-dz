import multer from "multer";
import path from "path";

const highlightStorage = multer.diskStorage({
  destination: "uploads/highlights",
  filename: (req, file, cb) => {
    cb(
      null,
      `highlight_${req.user.id}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

export const uploadHighlight = multer({ storage: highlightStorage }); 
