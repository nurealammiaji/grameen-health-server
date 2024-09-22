const Order = require('../models/orderModel');

// Function to calculate shipping charge based on delivery address
const calculateShippingCharge = (deliveryAddress) => {
    const cityKeyword = 'City';  // Define the keyword for determining if inside the city
    return deliveryAddress.includes(cityKeyword) ? 100 : 150;
};

// Create a new order with conditional shipping charge
const createOrder = async (req, res) => {
    try {
        const { userId, products, deliveryAddress, paymentMethod, paymentInfo, additionalShippingFee = 0 } = req.body;

        // Calculate total price of products
        let totalPrice = 0;
        products.forEach(item => {
            totalPrice += item.quantity * item.price;
        });

        // Calculate shipping charge
        const shippingCharge = calculateShippingCharge(deliveryAddress);

        // Calculate total order cost including shipping charges
        const total = totalPrice + shippingCharge + additionalShippingFee;

        // Create the new order
        const newOrder = new Order({
            userId,
            products,
            deliveryAddress,
            total,
            shippingCharge,
            additionalShippingFee,
            paymentMethod,
            paymentInfo
        });

        // Save the order to the database
        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create order', error: error.message });
    }
};

// Update an existing order
const updateOrder = async (req, res) => {
    const { id } = req.params;
    const { products, deliveryAddress, paymentMethod, paymentInfo, additionalShippingFee = 0 } = req.body;

    try {
        // Find the existing order
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Calculate shipping charge
        const shippingCharge = calculateShippingCharge(deliveryAddress);

        // Prepare fields to update
        const updatedFields = {
            products: products || order.products,
            deliveryAddress: deliveryAddress || order.deliveryAddress,
            paymentMethod: paymentMethod || order.paymentMethod,
            paymentInfo: paymentInfo || order.paymentInfo,
            shippingCharge,
            additionalShippingFee,
            total: (order.totalPrice || 0) + shippingCharge + additionalShippingFee
        };

        // Update the order
        const updatedOrder = await Order.findByIdAndUpdate(id, updatedFields, { new: true });

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Respond with the updated order
        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error("Error during order update:", error);
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

// Get all orders for a specific user
const getCustomerOrders = async (req, res) => {
    const { customerId } = req.params;

    try {
        const userOrders = await Order.find({ userId: customerId }).populate('userId').populate('products.productId');

        if (userOrders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this user' });
        }

        res.status(200).json(userOrders);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve user orders', error: error.message });
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

module.exports = { createOrder, updateOrder, getSingleOrder, getCustomerOrders, getAllOrders, deleteOrder };