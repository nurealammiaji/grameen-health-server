const multer = require('multer');
const fs = require('fs');
const path = require('path');

// for unique Id
let nanoid;
(async () => {
    const module = await import('nanoid');
    nanoid = module.nanoid;
})();

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
        fs.mkdir(uploadPath, { recursive: true }, (err) => {
            if (err) return cb(err);
            cb(null, uploadPath);  // Set the destination for the file
        });
    },
    filename: function (req, file, cb) {
        const uniqueId = nanoid(8);  // Generate a short unique ID
        const extName = path.extname(file.originalname);  // Get the file extension
        const type = req.body.type;

        let filename;
        if (type === 'user') {
            filename = `usr-${uniqueId}${extName}`;
        } else if (type === 'product') {
            filename = `prd-${uniqueId}${extName}`;
        } else {
            return cb(new Error('Unknown upload type'));
        }

        cb(null, filename);
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
    limits: { fileSize: 1024 * 1024 * 1 },  // Limit file size to 5MB
    fileFilter: fileFilter
});

module.exports = upload;