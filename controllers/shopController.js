const Shop = require('../models/shopModel');
const fs = require('fs/promises');

// Helper function to delete files
const deleteFiles = async (files) => {
    return Promise.all(files.map(async (file) => {
        try {
            await fs.unlink(file);
        } catch (err) {
            console.error(`Failed to delete file ${file}: ${err.message}`);
        }
    }));
};

// Create a new shop
const createShop = async (req, res) => {
    const { name, description, ownerId } = req.body;
    const shopLogo = req.files['shopLogo'] ? req.files['shopLogo'][0].path : null;
    const shopBanners = req.files['shopBanners[]'] ? req.files['shopBanners[]'].map(file => file.path) : [];

    try {
        const shop = new Shop({ name, description, ownerId, shopLogo, shopBanners });
        await shop.save();
        res.status(201).json(shop);
    } catch (error) {
        if (shopLogo) await fs.unlink(shopLogo).catch(err => console.error(`Failed to delete orphaned logo: ${err.message}`));
        await deleteFiles(shopBanners);
        res.status(500).json({ message: 'Failed to create shop', error: error.message });
    }
};

// Update an existing shop
const updateShop = async (req, res) => {
    const { shopId } = req.params;
    const { name, description } = req.body;
    const shop = await Shop.findById(shopId);

    if (!shop) return res.status(404).json({ message: 'Shop not found' });

    try {
        // Handle logo update
        if (req.files['shopLogo']) {
            if (shop.shopLogo) await fs.unlink(shop.shopLogo).catch(err => console.log('Failed to delete old logo', err));
            shop.shopLogo = req.files['shopLogo'][0].path;
        }

        // Handle banners update
        if (req.files['shopBanners']) {
            await deleteFiles(shop.shopBanners);
            shop.shopBanners = req.files['shopBanners'].map(file => file.path);
        }

        // Update name and description
        shop.name = name || shop.name;
        shop.description = description || shop.description;

        await shop.save();
        res.status(200).json(shop);
    } catch (error) {
        if (shop.shopLogo) await fs.unlink(shop.shopLogo).catch(err => console.error(`Failed to delete orphaned logo: ${err.message}`));
        await deleteFiles(req.files['shopBanners'] ? req.files['shopBanners'].map(file => file.path) : []);
        res.status(500).json({ message: 'Failed to update shop', error: error.message });
    }
};

// Get a single shop
const getSingleShop = async (req, res) => {
    try {
        const { shopId } = req.params;
        const shop = await Shop.findById(shopId);
        if (!shop) return res.status(404).json({ message: 'Shop not found' });
        res.status(200).json(shop);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve shop', error: error.message });
    }
};

// Get all shops for a specific Merchant
const getMerchantShops = async (req, res) => {
    try {
        const { merchantId } = req.params;
        const shops = await Shop.find({ ownerId: merchantId });
        if (shops.length === 0) return res.status(404).json({ message: 'No shops found for this user' });
        res.status(200).json(shops);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve shops for user', error: error.message });
    }
};

// Get all shops
const getAllShops = async (req, res) => {
    try {
        const shops = await Shop.find();
        res.status(200).json(shops);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve shops', error: error.message });
    }
};

// Delete a shop
const deleteShop = async (req, res) => {
    const { shopId } = req.params;

    try {
        const shop = await Shop.findById(shopId);
        if (!shop) return res.status(404).json({ message: 'Shop not found' });

        // Delete logo and banners
        await deleteFiles([shop.shopLogo, ...shop.shopBanners]);

        await Shop.findByIdAndDelete(shopId);
        res.status(200).json({ message: 'Shop deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete shop', error: error.message });
    }
};

module.exports = { createShop, updateShop, getSingleShop, getMerchantShops, getAllShops, deleteShop };

