const express = require('express');
const { createCart, updateCart, getSingleCart, getAllCarts, deleteCart } = require('../controllers/cartController');
const cartRoutes = express.Router();

cartRoutes.post('/carts', createCart);
cartRoutes.put('/carts/update', updateCart);
cartRoutes.get('/carts/get/:userId', getSingleCart);
cartRoutes.get('/carts/get', getAllCarts);
cartRoutes.delete('/carts/delete/:userId', deleteCart);

module.exports = cartRoutes;
