const express = require('express');
const { createOrder, updateOrder, getSingleOrder, getAllOrders, deleteOrder, getCustomerOrders } = require('../controllers/orderController');
const orderRoutes = express.Router();

orderRoutes.post('/orders/create', createOrder);
orderRoutes.put('/orders/update/:id', updateOrder);
orderRoutes.get('/orders/read/:id', getSingleOrder);
orderRoutes.get('/orders/read', getAllOrders);
orderRoutes.get('/orders/read/customers/:customerId', getCustomerOrders);
orderRoutes.delete('/orders/delete/:id', deleteOrder);

module.exports = orderRoutes;
