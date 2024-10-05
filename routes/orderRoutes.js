const express = require('express');
const { createOrder, updateOrder, getSingleOrder, getAllOrders, deleteOrder, getCustomerOrders } = require('../controllers/orderController');
const orderRoutes = express.Router();

orderRoutes.post('/orders/create', createOrder);
orderRoutes.put('/orders/update/:id', updateOrder);
orderRoutes.get('/orders/read', getAllOrders);
orderRoutes.get('/orders/read/:id', getSingleOrder);
orderRoutes.get('/orders/customers/read/:customerId', getCustomerOrders);
// Need shop orders
orderRoutes.delete('/orders/delete/:id', deleteOrder);

module.exports = orderRoutes;
