const Shop = require('../models/shopModel');
const fs = require('fs').promises;

// Create a new shop with single shopLogo and multiple shopBanners
const createShop = async (req, res) => {
    try {
        const { name, description, ownerId } = req.body;

        const shopLogo = req.files['shopLogo'] ? req.files['shopLogo'][0].path : null;
        const shopBanners = req.files['shopBanners'] ? req.files['shopBanners'].map(file => file.path) : [];

        console.log(name, description, ownerId, shopLogo, shopBanners);

        const shop = new Shop({
            name,
            description,
            ownerId,
            shopLogo,
            shopBanners
        });

        await shop.save();
        res.status(201).json(shop);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create shop', error: error.message });
    }
};

// Update an existing shop (with single logo and multiple banners)
const updateShop = async (req, res) => {
    try {
        const { shopId } = req.params;
        const { name, description } = req.body;

        const shop = await Shop.findById(shopId);
        if (!shop) return res.status(404).json({ message: 'Shop not found' });

        // Handle new logo upload and delete the old one if it exists
        if (req.files['shopLogo']) {
            if (shop.shopLogo) {
                await fs.unlink(shop.shopLogo).catch((err) => console.log('Failed to delete old logo', err));
            }
            shop.shopLogo = req.files['shopLogo'][0].path;
        }

        // Handle new banners upload and delete the old ones if they exist
        if (req.files['shopBanners']) {
            if (shop.shopBanners.length > 0) {
                await Promise.all(shop.shopBanners.map(async (banner) => {
                    await fs.unlink(banner).catch((err) => console.log('Failed to delete old banner', err));
                }));
            }
            shop.shopBanners = req.files['shopBanners'].map(file => file.path);
        }

        // Update name and description
        shop.name = name || shop.name;
        shop.description = description || shop.description;

        await shop.save();
        res.status(200).json(shop);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update shop', error: error.message });
    }
};

// Get a single shop by ID
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

// Get all shops
const getAllShops = async (req, res) => {
    try {
        const shops = await Shop.find();
        res.status(200).json(shops);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve shops', error: error.message });
    }
};

// Delete a shop (with promise-based image deletion)
const deleteShop = async (req, res) => {
    try {
        const { shopId } = req.params;
        console.log(shopId);

        const shop = await Shop.findById(shopId);
        if (!shop) return res.status(404).json({ message: 'Shop not found' });

        console.log("shop found", shop);

        // Delete logo and banners if they exist
        if (shop.shopLogo) {
            await fs.unlink(shop.shopLogo).catch((err) => console.log('Failed to delete shop logo', err));
        }

        if (shop.shopBanners.length > 0) {
            await Promise.all(shop.shopBanners.map(async (banner) => {
                await fs.unlink(banner).catch((err) => console.log('Failed to delete shop banner', err));
            }));
        }

        await Shop.findByIdAndDelete(shopId);
        res.status(200).json({ message: 'Shop deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete shop', error: error.message });
    }
};

module.exports = { createShop, updateShop, getSingleShop, getAllShops, deleteShop };
