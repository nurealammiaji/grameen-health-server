const express = require('express');
const { searchAll, searchUsers, searchAdmins, searchMerchants, searchCustomers, searchShops, searchProducts, searchCategories, searchSubCategories, getSearchHistory } = require('../controllers/searchController');

const searchRoutes = express.Router();

searchRoutes.get('/searches/read', searchAll);
searchRoutes.get('/searches/users/read', searchUsers);
searchRoutes.get('/searches/admins/read', searchAdmins);
searchRoutes.get('/searches/merchants/read', searchMerchants);
searchRoutes.get('/searches/customers/read', searchCustomers);
searchRoutes.get('/searches/shops/read', searchShops);
searchRoutes.get('/searches/products/read', searchProducts);
searchRoutes.get('/searches/categories/read', searchCategories);
searchRoutes.get('/searches/subCategories/read', searchSubCategories);
searchRoutes.get('/searches/histories/read/:userId', getSearchHistory);

module.exports = searchRoutes;
