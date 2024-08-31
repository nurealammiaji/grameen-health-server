const express = require('express');
const multer = require('multer');
const path = require('path');
const verifyJWT = require("../middlewares/jwtVerification");
const verifyAdmin = require("../middlewares/adminVerification");
const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

const productRoutes = express.Router();

// Set up multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'temp/'); // Use a temporary directory for storing files before FTP upload
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload an image.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

// Routes for CRUD operations
productRoutes.post('/products', verifyJWT, upload.array('images', 5), createProduct); // Create a new product with up to 5 images
productRoutes.get('/products', getAllProducts); // Get all products
productRoutes.get('/products/:id', getProductById); // Get a product by ID
productRoutes.put('/products/:id', verifyJWT, upload.array('images', 5), updateProduct); // Update a product by ID with up to 5 new images
productRoutes.delete('/products/:id', verifyJWT, deleteProduct); // Delete a product by ID

module.exports = productRoutes;
