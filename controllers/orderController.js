const Order = require('../models/orderModel');

// Create a new order
const createOrder = async (req, res) => {
    try {
        const { userId, products, total, status, deliveryAddress, paymentMethod, paymentInfo } = req.body;

        const newOrder = new Order({
            userId,
            products,
            total,
            status,
            deliveryAddress,
            paymentMethod,
            paymentInfo
        });

        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create order', error: error.message });
    }
};

// Update an existing order
const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedOrderData = req.body;

        const updatedOrder = await Order.findByIdAndUpdate(id, updatedOrderData, { new: true });

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update order', error: error.message });
    }
};

// Get a single order by ID
const getSingleOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id).populate('userId').populate('products.productId');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get order', error: error.message });
    }
};

// Get all orders
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('userId').populate('products.productId');

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve orders', error: error.message });
    }
};

// Delete an order
const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedOrder = await Order.findByIdAndDelete(id);

        if (!deletedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete order', error: error.message });
    }
};


module.exports = { createOrder, updateOrder, getSingleOrder, getAllOrders, deleteOrder };