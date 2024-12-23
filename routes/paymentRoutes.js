const express = require('express');
const paymentRoutes = express.Router();
const { createPayment, updatePayment, getSinglePayment, getAllPayments, deletePayment } = require('../controllers/paymentController');

paymentRoutes.post('/payments/create', createPayment);
paymentRoutes.put('/payments/update/:paymentId', updatePayment);
paymentRoutes.get('/payments/read', getAllPayments);
paymentRoutes.get('/payments/read/:paymentId', getSinglePayment);
paymentRoutes.delete('/payments/delete/:paymentId', deletePayment);

module.exports = paymentRoutes;
