const Order = require('../models/orderModel');

// Function to calculate shipping charge based on delivery address
const calculateShippingCharge = (deliveryAddress) => {
    const cityKeyword = 'City';  // Define the keyword for determining if inside the city
    return deliveryAddress.includes(cityKeyword) ? 100 : 150;
};

const createOrder = async (req, res) => {
    const { userId, products, deliveryAddress, paymentMethod, paymentInfo } = req.body;

    try {
        const orderProducts = await Promise.all(
            products.map(async ({ productId, quantity }) => {
                const product = await Product.findById(productId);
                if (!product) throw new Error('Product not found');
                if (product.quantity < quantity) throw new Error('Insufficient stock for product: ' + product.name);

                return {
                    productId,
                    shopId: product.shop, // Get shopId from product
                    quantity,
                    price: product.price // Assuming price is the same as the product's price
                };
            })
        );

        // Calculate total price of products
        let totalPrice = 0;
        products.forEach(item => {
            totalPrice += item.quantity * item.price;
        });

        // Calculate shipping charge
        const shippingCharge = calculateShippingCharge(deliveryAddress);

        // Calculate total order cost including shipping charges
        const total = totalPrice + shippingCharge + additionalShippingFee;

        const newOrder = new Order({
            userId,
            products: orderProducts,
            total,
            shippingCharge,
            deliveryAddress,
            paymentMethod,
            paymentInfo
        });

        await newOrder.save();

        // Update product quantities in stock
        await Promise.all(orderProducts.map(async ({ productId, quantity }) => {
            await Product.findByIdAndUpdate(productId, { $inc: { quantity: -quantity } });
        }));

        res.status(201).json(newOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateOrder = async (req, res) => {
    const { orderId } = req.params;
    const { userId, products, deliveryAddress, paymentMethod, paymentInfo } = req.body;

    try {
        // Fetch the existing order
        const existingOrder = await Order.findById(orderId);
        if (!existingOrder) throw new Error('Order not found');

        // Handle product updates
        const orderProducts = await Promise.all(
            products.map(async ({ productId, quantity }) => {
                const product = await Product.findById(productId);
                if (!product) throw new Error('Product not found');
                if (product.quantity + existingOrder.products.find(p => p.productId.toString() === productId)?.quantity < quantity) {
                    throw new Error('Insufficient stock for product: ' + product.name);
                }

                return {
                    productId,
                    shopId: product.shop,
                    quantity,
                    price: product.price
                };
            })
        );

        // Calculate total price of products
        let totalPrice = 0;
        orderProducts.forEach(item => {
            totalPrice += item.quantity * item.price;
        });

        // Calculate shipping charge
        const shippingCharge = calculateShippingCharge(deliveryAddress);

        // Total order cost
        const total = totalPrice + shippingCharge; // Assuming additionalShippingFee is handled elsewhere

        // Update the order with new details
        existingOrder.userId = userId || existingOrder.userId; // Keep existing userId if not provided
        existingOrder.products = orderProducts;
        existingOrder.total = total;
        existingOrder.shippingCharge = shippingCharge;
        existingOrder.deliveryAddress = deliveryAddress || existingOrder.deliveryAddress; // Keep existing address if not provided
        existingOrder.paymentMethod = paymentMethod || existingOrder.paymentMethod; // Keep existing payment method if not provided
        existingOrder.paymentInfo = paymentInfo || existingOrder.paymentInfo; // Keep existing payment info if not provided

        await existingOrder.save();

        // Update product quantities in stock
        await Promise.all(orderProducts.map(async ({ productId, quantity }) => {
            const existingQuantity = existingOrder.products.find(p => p.productId.toString() === productId)?.quantity || 0;
            const quantityDifference = quantity - existingQuantity; // Calculate how much the stock needs to be adjusted
            await Product.findByIdAndUpdate(productId, { $inc: { quantity: -quantityDifference } });
        }));

        res.status(200).json(existingOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateOrderStatus = async (req, res) => {
    const { orderId } = req.params; // Get orderId from request parameters
    const { status } = req.body; // Get new status from request body

    try {
        // Validate the new status (you can customize this list based on your application)
        const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        // Find the order by ID and update the status
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true } // Return the updated document
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(updatedOrder); // Return the updated order
    } catch (error) {
        res.status(500).json({ message: 'Failed to update order status', error: error.message });
    }
};


// Create a new order with conditional shipping charge
// const createOrder = async (req, res) => {
//     try {
//         const { userId, products, deliveryAddress, paymentMethod, paymentInfo, additionalShippingFee = 0 } = req.body;

//         // Calculate total price of products
//         let totalPrice = 0;
//         products.forEach(item => {
//             totalPrice += item.quantity * item.price;
//         });

//         // Calculate shipping charge
//         const shippingCharge = calculateShippingCharge(deliveryAddress);

//         // Calculate total order cost including shipping charges
//         const total = totalPrice + shippingCharge + additionalShippingFee;

//         // Create the new order
//         const newOrder = new Order({
//             userId,
//             products,
//             deliveryAddress,
//             total,
//             shippingCharge,
//             additionalShippingFee,
//             paymentMethod,
//             paymentInfo
//         });

//         // Save the order to the database
//         await newOrder.save();
//         res.status(201).json(newOrder);
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to create order', error: error.message });
//     }
// };

// Update an existing order
// const updateOrder = async (req, res) => {
//     const { id } = req.params;
//     const { products, deliveryAddress, paymentMethod, paymentInfo, additionalShippingFee = 0 } = req.body;

//     try {
//         // Find the existing order
//         const order = await Order.findById(id);
//         if (!order) {
//             return res.status(404).json({ message: 'Order not found' });
//         }

//         // Calculate shipping charge
//         const shippingCharge = calculateShippingCharge(deliveryAddress);

//         // Prepare fields to update
//         const updatedFields = {
//             products: products || order.products,
//             deliveryAddress: deliveryAddress || order.deliveryAddress,
//             paymentMethod: paymentMethod || order.paymentMethod,
//             paymentInfo: paymentInfo || order.paymentInfo,
//             shippingCharge,
//             additionalShippingFee,
//             total: (order.totalPrice || 0) + shippingCharge + additionalShippingFee
//         };

//         // Update the order
//         const updatedOrder = await Order.findByIdAndUpdate(id, updatedFields, { new: true });

//         if (!updatedOrder) {
//             return res.status(404).json({ message: 'Order not found' });
//         }

//         // Respond with the updated order
//         res.status(200).json(updatedOrder);
//     } catch (error) {
//         console.error("Error during order update:", error);
//         res.status(500).json({ message: 'Failed to update order', error: error.message });
//     }
// };

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

// Get all orders for a specific shop
const getShopOrders = async (req, res) => {
    const { shopId } = req.params; // Extract shopId from request parameters

    try {
        // Fetch all orders and populate userId and productId
        const allOrders = await Order.find()
            .populate('userId') // Populate user details
            .populate('products.productId'); // Populate product details

        // Filter orders for the specified shop
        const shopOrders = allOrders.map(order => ({
            ...order._doc,
            products: order.products.filter(product => product.shopId.toString() === shopId) // Filter products by shopId
        })).filter(order => order.products.length > 0); // Keep only orders with products from the specified shop

        if (shopOrders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this shop' });
        }

        res.status(200).json(shopOrders); // Respond with the filtered orders
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve shop orders', error: error.message });
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

module.exports = { createOrder, updateOrder, updateOrderStatus, getSingleOrder, getCustomerOrders, getShopOrders, getAllOrders, deleteOrder };