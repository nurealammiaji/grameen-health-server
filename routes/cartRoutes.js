const express = require('express');
const { createCart, updateCart, getAllCarts, deleteCart, getSingleCart } = require('../controllers/cartController');
const cartRoutes = express.Router();

cartRoutes.post('/carts/create', createCart);
cartRoutes.put('/carts/update/:userId', updateCart);
cartRoutes.get('/carts/read', getAllCarts);
cartRoutes.get('/carts/read/:userId', getSingleCart);
cartRoutes.delete('/carts/delete/:userId', deleteCart);

module.exports = cartRoutes;
