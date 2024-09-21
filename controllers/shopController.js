const Shop = require('../models/shopModel');
const fs = require('fs/promises');

// Create a new shop with single shopLogo and multiple shopBanners
const createShop = async (req, res) => {
    let shopLogo;
    let shopBanners;
    try {
        const { name, description, ownerId } = req.body;

        shopLogo = req.files['shopLogo'] ? req.files['shopLogo'][0].path : null;
        shopBanners = req.files['shopBanners'] ? req.files['shopBanners'].map(file => file.path) : [];

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
        if (shopLogo) {
            try {
                await fs.unlink(shopLogo);
                console.error(`Deleted orphaned image successfully: ${err.message}`);
            } catch (err) {
                console.error(`Failed to delete orphaned image: ${err.message}`);
            }
        }
        if (shopBanners) {
            try {
                await fs.unlink(shopBanners);
                console.error(`Deleted orphaned images successfully: ${err.message}`);
            } catch (err) {
                console.error(`Failed to delete orphaned images: ${err.message}`);
            }
        }
        res.status(500).json({ message: 'Failed to create shop', error: error.message });
    }
};

// Update an existing shop (with single logo and multiple banners)
const updateShop = async (req, res) => {
    let newShopLogo;
    let newShopBanners;
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
            newShopLogo = req.files['shopLogo'][0].path;
            shop.shopLogo = newShopLogo;
        }

        // Handle new banners upload and delete the old ones if they exist
        if (req.files['shopBanners']) {
            if (shop.shopBanners.length > 0) {
                await Promise.all(shop.shopBanners.map(async (banner) => {
                    await fs.unlink(banner).catch((err) => console.log('Failed to delete old banner', err));
                }));
            }
            newShopBanners = req.files['shopBanners'].map(file => file.path);
            shop.shopBanners = newShopBanners;
        }

        // Update name and description
        shop.name = name || shop.name;
        shop.description = description || shop.description;

        await shop.save();
        res.status(200).json(shop);
    } catch (error) {
        if (newShopLogo) {
            try {
                await fs.unlink(newShopLogo);
                console.error(`Deleted orphaned image successfully: ${err.message}`);
            } catch (err) {
                console.error(`Failed to delete orphaned image: ${err.message}`);
            }
        }
        if (newShopBanners) {
            try {
                await fs.unlink(newShopBanners);
                console.error(`Deleted orphaned images successfully: ${err.message}`);
            } catch (err) {
                console.error(`Failed to delete orphaned images: ${err.message}`);
            }
        }
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

// Get all shops for a specific user
const getMerchantShops = async (req, res) => {
    try {
        const { merchantId } = req.params;
        const shops = await Shop.find({ ownerId: merchantId });

        if (shops.length === 0) {
            return res.status(404).json({ message: 'No shops found for this user' });
        }

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

module.exports = { createShop, updateShop, getSingleShop, getMerchantShops, getAllShops, deleteShop };
