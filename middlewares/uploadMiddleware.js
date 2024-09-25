const multer = require('multer');
const fs = require('fs/promises');
const path = require('path');

// for unique Id
let nanoid;
(async () => {
    const module = await import('nanoid');
    nanoid = module.nanoid;
})();

const typeMappings = {
    user: 'usr',
    product: 'prd',
    carousel: 'crs',
    shop: 'shp',
    category: 'ctg',
    subCategory: 'sbCtg'
};

// Multer storage configuration
const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        const type = req.body.type || req.query.type || 'unknown';

        // Logging to debug type value
        console.log('Upload type:', type);

        const uploadPath = (type === 'category' || 'subCategory') ? `uploads/images/${type.slice(0, -1)}ies` : `uploads/images/${type}s`;

        try {
            await fs.mkdir(uploadPath, { recursive: true });
            cb(null, uploadPath);
        } catch (err) {
            cb(err);
        }
    },
    filename: function (req, file, cb) {
        const uniqueId = nanoid(8);
        const extName = path.extname(file.originalname);
        const prefix = typeMappings[req.body.type] || 'unknown';

        // Logging to debug filename prefix
        console.log('Filename prefix:', prefix);

        const filename = `${prefix}-${uniqueId}${extName}`;

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
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter: fileFilter
});

module.exports = upload;