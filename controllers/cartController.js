const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

// Create a new cart for a user
const createCart = async (req, res) => {
    try {
        const { userId, products } = req.body;

        // Calculate total quantity and total price
        let totalQuantity = 0;
        let totalPrice = 0;

        const productDetails = await Promise.all(
            products.map(async (item) => {
                const product = await Product.findById(item.productId);
                if (!product) throw new Error('Product not found');
                totalQuantity += item.quantity;
                totalPrice += item.quantity * product.price;
                return {
                    productId: item.productId,
                    shopId: product.shop,
                    quantity: item.quantity,
                    price: product.price
                };
            })
        );

        // Create new cart
        const cart = new Cart({
            userId,
            products: productDetails,
            totalQuantity,
            totalPrice
        });

        // Save cart to database
        await cart.save();

        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create cart', error: error.message });
    }
};

// Update an existing cart (add/remove/update products)
const updateCart = async (req, res) => {
    try {
        const { userId } = req.params;
        const { products } = req.body;

        // Find existing cart
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Calculate total quantity and total price
        let totalQuantity = 0;
        let totalPrice = 0;

        const updatedProducts = await Promise.all(
            products.map(async (item) => {
                const product = await Product.findById(item.productId);
                if (!product) throw new Error('Product not found');
                totalQuantity += item.quantity;
                totalPrice += item.quantity * product.price;
                return {
                    productId: item.productId,
                    shopId: product.shop,
                    quantity: item.quantity,
                    price: product.price
                };
            })
        );

        // Update cart with new products and totals
        cart.products = updatedProducts;
        cart.totalQuantity = totalQuantity;
        cart.totalPrice = totalPrice;

        // Save updated cart
        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update cart', error: error.message });
    }
};

// Get a single cart by userId
const getSingleCart = async (req, res) => {
    try {
        const { userId } = req.params;

        const cart = await Cart.findOne({ userId }).populate('products.productId');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve cart', error: error.message });
    }
};

// Get all carts (e.g., for admins to view all users' carts)
const getAllCarts = async (req, res) => {
    try {
        const carts = await Cart.find().populate('userId products.productId');

        res.status(200).json(carts);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve carts', error: error.message });
    }
};

// Delete a cart by userId
const deleteCart = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find and delete the cart for the given userId
        const deletedCart = await Cart.findOneAndDelete({ userId });

        if (!deletedCart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        res.status(200).json({ message: 'Cart deleted successfully', cart: deletedCart });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete cart', error: error.message });
    }
};


module.exports = { createCart, updateCart, getSingleCart, getAllCarts, deleteCart };