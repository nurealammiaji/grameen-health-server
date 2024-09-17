const express = require('express');
const productRoutes = express.Router();
const { createProduct, getSingleProduct, getAllProducts, updateProduct, deleteProduct } = require('../controllers/productController');
const upload = require('../middlewares/uploadMiddleware');

// Routes
productRoutes.post('/products/create', upload.array('images', 5), createProduct);
productRoutes.put('/products/update/:id', upload.array('images', 5), updateProduct);
productRoutes.get('/products/get', getAllProducts);
productRoutes.get('/products/get/:id', getSingleProduct);
productRoutes.delete('/products/delete/:id', deleteProduct);

module.exports = productRoutes;
