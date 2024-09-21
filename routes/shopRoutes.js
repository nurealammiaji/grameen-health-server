const express = require('express');
const shopRoutes = express.Router();
const { createShop, updateShop, getSingleShop, getAllShops, deleteShop, getMerchantShops } = require('../controllers/shopController');
const upload = require('../middlewares/uploadMiddleware');

shopRoutes.post('/shops/create', upload.fields([{ name: 'shopLogo', maxCount: 1 }, { name: 'shopBanners', maxCount: 5 }]), createShop);
shopRoutes.put('/shops/update/:shopId', upload.fields([{ name: 'shopLogo', maxCount: 1 }, { name: 'shopBanners', maxCount: 5 }]), updateShop);
shopRoutes.get('/shops/read/:shopId', getSingleShop);
shopRoutes.get('/shops/read/merchant/:merchantId', getMerchantShops);
shopRoutes.get('/shops/read', getAllShops);
shopRoutes.delete('/shops/delete/:shopId', deleteShop);

module.exports = shopRoutes;
