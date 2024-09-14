const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Multer storage configuration with dynamic paths based on type
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const type = req.body.type || req.query.type || 'unknown';  // Getting type from body or query

        // Define the base path for user and product uploads
        let uploadPath;
        if (type === 'user') {
            uploadPath = 'uploads/images/users';
        } else if (type === 'product') {
            uploadPath = 'uploads/images/products';
        } else {
            return cb(new Error('Unknown upload type'));  // Handling unknown type
        }

        // Ensure the directory exists
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);  // Set the destination for the file
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);  // Generate a unique file name
    }
});

// Define file filter for images
const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (extName && mimeType) {
        cb(null, true);
    } else {
        cb(new Error('Only images are allowed'));
    }
};

// Multer middleware configuration
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 },  // Limit file size to 5MB
    fileFilter: fileFilter
});

module.exports = upload;




// const multer = require('multer');
// const path = require('path');

// // Define where to store uploaded images and how to name them
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/images');
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // e.g., '123456789.png'
//   },
// });

// // File filtering to allow only image uploads
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = /jpeg|jpg|png|gif/;
//   const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = allowedTypes.test(file.mimetype);

//   if (extname && mimetype) {
//     return cb(null, true);
//   } else {
//     cb('Images only!');
//   }
// };

// // Middleware for handling single image uploads
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 1024 * 1024 * 1 }, // 1MB size limit
//   fileFilter: fileFilter,
// });

// module.exports = upload;
