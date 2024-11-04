const express = require('express');
const { createCategory, updateCategory, getAllCategories, getSingleCategory, deleteCategory, deleteCategories } = require('../controllers/categoryController');
const upload = require('../middlewares/uploadMiddleware');
const categoryRoutes = express.Router();

categoryRoutes.post('/categories/create', upload.single('image'), createCategory);
categoryRoutes.put('/categories/update/:id', upload.single('image'), updateCategory);
categoryRoutes.get('/categories/read', getAllCategories);
categoryRoutes.get('/categories/read/:id', getSingleCategory);
categoryRoutes.delete('/categories/delete', deleteCategories);
categoryRoutes.delete('/categories/delete/:id', deleteCategory);

module.exports = categoryRoutes;