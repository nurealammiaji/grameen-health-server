const express = require('express');
const productRoutes = express.Router();
const { createProduct, getSingleProduct, getAllProducts, updateProduct, deleteProduct, getShopProducts } = require('../controllers/productController');
const upload = require('../middlewares/uploadMiddleware');

// Routes
productRoutes.post('/products/create', upload.array('images', 5), createProduct);
productRoutes.put('/products/update/:id', upload.array('images', 5), updateProduct);
productRoutes.get('/products/read', getAllProducts);
productRoutes.get('/products/shop/:shopId', getShopProducts);
productRoutes.get('/products/read/:id', getSingleProduct);
productRoutes.delete('/products/delete/:id', deleteProduct);

module.exports = productRoutes;
