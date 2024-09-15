const express = require('express');
const productsRoutes = express.Router();
const { createProduct, getSingleProduct, getAllProducts, updateProduct, deleteProduct } = require('../controllers/productController');
const upload = require('../middlewares/uploadMiddleware'); // Multer middleware for file upload

// Routes
productsRoutes.post('/products/create', upload.array('images', 5), createProduct);
productsRoutes.put('/products/update/:id', upload.array('images', 5), updateProduct);
productsRoutes.get('/products', getAllProducts);
productsRoutes.get('/products/:id', getSingleProduct);
productsRoutes.delete('/products/delete/:id', deleteProduct);

module.exports = productsRoutes;
