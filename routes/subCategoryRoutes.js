const express = require('express');
const { createSubCategory, updateSubCategory, getAllSubCategories, getSingleSubCategory, deleteSubCategory, getSubCategoriesByCategory } = require('../controllers/subCategoryController');
const upload = require('../middlewares/uploadMiddleware');
const subCategoryRoutes = express.Router();

subCategoryRoutes.post('/subCategories/create', upload.single('image'), createSubCategory);
subCategoryRoutes.put('/subCategories/update/:id', upload.single('image'), updateSubCategory);
subCategoryRoutes.get('/subCategories/read', getAllSubCategories);
subCategoryRoutes.get('/subCategories/read/:id', getSingleSubCategory);
subCategoryRoutes.get('/subCategories/categories/read/:categoryId', getSubCategoriesByCategory);
subCategoryRoutes.delete('/subCategories/delete/:id', deleteSubCategory);

module.exports = subCategoryRoutes;
