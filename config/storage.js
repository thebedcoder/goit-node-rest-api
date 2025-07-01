import path from "path";
import multer from "multer";

const avatarsDir = path.join(process.cwd(), "public", "avatars");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, avatarsDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = ["image/jpeg", "image/png", "image/gif"];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only JPEG, PNG and GIF are allowed."),
      false,
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 },
});

export { upload, avatarsDir };
