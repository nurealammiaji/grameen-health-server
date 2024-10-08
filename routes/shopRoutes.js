const express = require('express');
const shopRoutes = express.Router();
const { createShop, updateShop, getSingleShop, getAllShops, deleteShop, getMerchantShops, deleteShops } = require('../controllers/shopController');
const upload = require('../middlewares/uploadMiddleware');

shopRoutes.post('/shops/create', upload.fields([{ name: 'shopLogo', maxCount: 1 }, { name: 'shopBanners[]', maxCount: 5 }]), createShop);
shopRoutes.put('/shops/update/:shopId', upload.fields([{ name: 'shopLogo', maxCount: 1 }, { name: 'shopBanners[]', maxCount: 5 }]), updateShop);
shopRoutes.get('/shops/read', getAllShops);
shopRoutes.get('/shops/read/:shopId', getSingleShop);
shopRoutes.get('/shops/merchants/read/:merchantId', getMerchantShops);
shopRoutes.delete('/shops/delete/:shopId', deleteShop);
shopRoutes.delete('/shops/delete', deleteShops);

module.exports = shopRoutes;
