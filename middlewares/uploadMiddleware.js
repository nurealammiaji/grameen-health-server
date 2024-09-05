const multer = require('multer');
const path = require('path');

// Define where to store uploaded images and how to name them
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // e.g., '123456789.png'
  },
});

// File filtering to allow only image uploads
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images only!');
  }
};

// Middleware for handling single image uploads
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 1 }, // 1MB size limit
  fileFilter: fileFilter,
});

module.exports = upload;
