const express = require('express');
const { searchAll, searchUsers, searchAdmins, searchMerchants, searchCustomers, searchShops, searchProducts, searchCategories, searchSubCategories, getSearchHistory } = require('../controllers/searchController');

const searchRoutes = express.Router();

searchRoutes.get('/searches/read', searchAll);
searchRoutes.get('/searches/read/users', searchUsers);
searchRoutes.get('/searches/read/admins', searchAdmins);
searchRoutes.get('/searches/read/merchants', searchMerchants);
searchRoutes.get('/searches/read/customers', searchCustomers);
searchRoutes.get('/searches/read/shops', searchShops);
searchRoutes.get('/searches/read/products', searchProducts);
searchRoutes.get('/searches/read/categories', searchCategories);
searchRoutes.get('/searches/read/subCategories', searchSubCategories);
searchRoutes.get('/searches/read/histories/:userId', getSearchHistory);

module.exports = searchRoutes;
