const express = require('express');
const { createOrder, updateOrder, getSingleOrder, getAllOrders, deleteOrder, getCustomerOrders, getShopOrders, updateOrderStatus } = require('../controllers/orderController');
const orderRoutes = express.Router();

orderRoutes.post('/orders/create', createOrder);
orderRoutes.put('/orders/update/:id', updateOrder);
orderRoutes.put('/orders/status/update/:orderId', updateOrderStatus);
orderRoutes.get('/orders/read', getAllOrders);
orderRoutes.get('/orders/read/:id', getSingleOrder);
orderRoutes.get('/orders/shops/read/:shopId', getShopOrders);
orderRoutes.get('/orders/customers/read/:customerId', getCustomerOrders);
orderRoutes.delete('/orders/delete/:id', deleteOrder);

module.exports = orderRoutes;
