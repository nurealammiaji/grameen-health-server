const express = require('express');
const shopRoutes = express.Router();
const { createShop, updateShop, getSingleShop, getAllShops, deleteShop } = require('../controllers/shopController');
const upload = require('../middlewares/uploadMiddleware');

shopRoutes.post('/shops', upload.fields([{ name: 'shopLogo', maxCount: 1 }, { name: 'shopBanner', maxCount: 1 }]), createShop);
shopRoutes.put('/shops/:shopId', upload.fields([{ name: 'shopLogo', maxCount: 1 }, { name: 'shopBanner', maxCount: 1 }]), updateShop);
shopRoutes.get('/shops/:shopId', getSingleShop);
shopRoutes.get('/shops', getAllShops);
shopRoutes.delete('/shop/:shopId', deleteShop);

module.exports = shopRoutes;
