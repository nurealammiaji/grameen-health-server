const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const SubCategory = require('../models/subCategoryModel');
const Shop = require('../models/shopModel');
const User = require('../models/userModel');
const Search = require('../models/searchModel');

const searchAll = async (req, res) => {
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

const searchProducts = async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ message: 'Search query is required' });
    }

    try {
        const products = await Product.find({ name: { $regex: query, $options: 'i' } });
        res.status(200).json(products);
    } catch (error) {
        console.error('Error searching products:', error);
        res.status(500).json({ message: 'Failed to search products', error: error.message });
    }
};

const searchUsers = async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ message: 'Search query is required' });
    }

    try {
        const users = await User.find({ name: { $regex: query, $options: 'i' } });
        res.status(200).json(users);
    } catch (error) {
        console.error('Error searching users:', error);
        res.status(500).json({ message: 'Failed to search users', error: error.message });
    }
};

const searchMerchants = async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ message: 'Search query is required' });
    }

    try {
        const merchants = await User.find({
            role: 'merchant',
            name: { $regex: query, $options: 'i' }
        });
        res.status(200).json(merchants);
    } catch (error) {
        console.error('Error searching merchants:', error);
        res.status(500).json({ message: 'Failed to search merchants', error: error.message });
    }
};

const searchAdmins = async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ message: 'Search query is required' });
    }

    try {
        const admins = await User.find({
            role: 'admin',
            name: { $regex: query, $options: 'i' }
        });
        res.status(200).json(admins);
    } catch (error) {
        console.error('Error searching admins:', error);
        res.status(500).json({ message: 'Failed to search admins', error: error.message });
    }
};

const searchCustomers = async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ message: 'Search query is required' });
    }

    try {
        const customers = await User.find({
            role: 'customer',
            name: { $regex: query, $options: 'i' }
        });
        res.status(200).json(customers);
    } catch (error) {
        console.error('Error searching customers:', error);
        res.status(500).json({ message: 'Failed to search customers', error: error.message });
    }
};

const searchCategories = async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ message: 'Search query is required' });
    }

    try {
        const categories = await Category.find({ name: { $regex: query, $options: 'i' } });
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error searching categories:', error);
        res.status(500).json({ message: 'Failed to search categories', error: error.message });
    }
};

const searchSubCategories = async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ message: 'Search query is required' });
    }

    try {
        const subCategories = await SubCategory.find({ name: { $regex: query, $options: 'i' } });
        res.status(200).json(subCategories);
    } catch (error) {
        console.error('Error searching subcategories:', error);
        res.status(500).json({ message: 'Failed to search subcategories', error: error.message });
    }
};

const searchShops = async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ message: 'Search query is required' });
    }

    try {
        const shops = await Shop.find({ name: { $regex: query, $options: 'i' } });
        res.status(200).json(shops);
    } catch (error) {
        console.error('Error searching shops:', error);
        res.status(500).json({ message: 'Failed to search shops', error: error.message });
    }
};

const getSearchHistory = async (req, res) => {
    const userId = req.params.userId;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        const history = await Search.find({ userId })
            .sort({ timestamp: -1 }); // Sort by most recent first

        res.status(200).json(history);
    } catch (error) {
        console.error('Error retrieving search history:', error);
        res.status(500).json({ message: 'Failed to retrieve search history', error: error.message });
    }
};


module.exports = { searchAll, searchUsers, searchCustomers, searchMerchants, searchAdmins, searchShops, searchProducts, searchCategories, searchSubCategories, getSearchHistory };
