const express = require('express');
const { createSubCategory, updateSubCategory, getAllSubCategories, getSingleSubCategory, deleteSubCategory, getSubCategoriesByCategory } = require('../controllers/subCategoryController');

const subCategoryRoutes = express.Router();

subCategoryRoutes.post('/subCategory/create', createSubCategory);
subCategoryRoutes.put('/subCategory/update/:id', updateSubCategory);
subCategoryRoutes.get('/subCategory/read', getAllSubCategories);
subCategoryRoutes.get('/subCategory/read/:id', getSingleSubCategory);
subCategoryRoutes.get('/subCategory/read/categories/:categoryId', getSubCategoriesByCategory);
subCategoryRoutes.delete('/subCategory/delete/:id', deleteSubCategory);

module.exports = subCategoryRoutes;
