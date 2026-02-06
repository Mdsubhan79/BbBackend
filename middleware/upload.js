const multer = require("multer");
const path = require("path");

/* ========= STORAGE ========= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      uniqueName + path.extname(file.originalname)
    );
  }
});

/* ========= FILE FILTER ========= */
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const ext = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mime = allowedTypes.test(file.mimetype);

  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error("Only images allowed"));
  }
};

/* ========= MULTER CONFIG ========= */
const upload = multer({
  storage,
  limits: {
    fileSize: 200 * 1024 // ✅ 200 KB limit
  },
  fileFilter
});

module.exports = upload;
