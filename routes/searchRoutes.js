const express = require('express');
const { searchItems } = require('../controllers/searchController');

const searchRoutes = express.Router();

// Route for searching products, categories, subcategories, shops, and users
searchRoutes.get('/search', searchItems);

module.exports = searchRoutes;
