const express = require('express');
const { createOrder, updateOrder, getSingleOrder, getAllOrders, deleteOrder } = require('../controllers/orderController');
const orderRoutes = express.Router();

orderRoutes.post('/orders/create', createOrder);
orderRoutes.put('/orders/update/:id', updateOrder);
orderRoutes.delete('/orders/delete/:id', deleteOrder);
orderRoutes.get('/orders/get/:id', getSingleOrder);
orderRoutes.get('/orders/get', getAllOrders);

module.exports = orderRoutes;
