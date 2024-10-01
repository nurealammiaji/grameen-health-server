const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const SubCategory = require('../models/subCategoryModel');
const Shop = require('../models/shopModel');
const User = require('../models/userModel'); // Import the User model

// Search controller for products, categories, subcategories, shops, and users
const searchItems = async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ message: 'Search query is required' });
    }

    try {
        const products = await Product.find({ name: { $regex: query, $options: 'i' } });
        const categories = await Category.find({ name: { $regex: query, $options: 'i' } });
        const subCategories = await SubCategory.find({ name: { $regex: query, $options: 'i' } });
        const shops = await Shop.find({ name: { $regex: query, $options: 'i' } });
        const users = await User.find({ name: { $regex: query, $options: 'i' } });

        res.status(200).json({
            products,
            categories,
            subCategories,
            shops,
            users,
        });
    } catch (error) {
        console.error('Error searching items:', error);
        res.status(500).json({ message: 'Failed to search items', error: error.message });
    }
};

module.exports = { searchItems };
