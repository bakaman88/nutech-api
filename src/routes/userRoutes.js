const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { getProfile, updateProfile, uploadProfileImage } = require("../controllers/userController");
const multer = require("multer");
const path = require("path");

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if ([".png", ".jpg", ".jpeg"].includes(ext)) cb(null, true);
  else cb(new Error("Format file hanya PNG/JPG/JPEG"));
};

const upload = multer({ storage, fileFilter });

// Routes
router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);
router.post("/profile/image", auth, upload.single("image"), uploadProfileImage);

module.exports = router;
