const express = require('express');
const { createCategory, updateCategory, getAllCategories, getSingleCategory, deleteCategory } = require('../controllers/categoryController');

const categoryRoutes = express.Router();

// Route to create a new category
categoryRoutes.post('/categories/create', createCategory);
categoryRoutes.put('/categories/update/:id', updateCategory);
categoryRoutes.get('/categories/read', getAllCategories);
categoryRoutes.get('/categories/read/:id', getSingleCategory);
categoryRoutes.delete('/categories/delete/:id', deleteCategory);

module.exports = categoryRoutes;