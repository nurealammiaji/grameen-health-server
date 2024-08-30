const express = require("express");
const multer = require('multer');
const path = require('path');
const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/productController');

const productRoutes = express.Router();

// Set up multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/path/to/your/cpanel/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    // Accept image files only
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

// Product Routes
productRoutes.post('/products', upload.array('images', 5), createProduct); // Handle multiple images
productRoutes.get('/products', getAllProducts);
productRoutes.get('/products/:id', getProductById);
productRoutes.put('/products/:id', upload.array('images', 5), updateProduct); // Handle multiple images
productRoutes.delete('/products/:id', deleteProduct);

module.exports = productRoutes;
