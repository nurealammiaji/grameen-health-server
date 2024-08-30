const Product = require('../models/product');

// Create a new product
exports.createProduct = async (req, res) => {
    try {
        const { name, price, description, variants } = req.body;
        const images = req.files ? req.files.map(file => file.path) : []; // Get paths of uploaded images

        const product = new Product({
            name,
            price,
            description,
            images,
            variants: JSON.parse(variants) // Parse JSON string of variants
        });

        await product.save();
        res.status(201).json({ message: 'Product created successfully', product });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create product', error });
    }
};

// Update a product by ID
exports.updateProduct = async (req, res) => {
    try {
        const { name, price, description, variants } = req.body;
        const images = req.files ? req.files.map(file => file.path) : []; // Get paths of uploaded images

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.name = name || product.name;
        product.price = price || product.price;
        product.description = description || product.description;
        product.images = images.length ? images : product.images; // Update images if new ones are provided
        product.variants = JSON.parse(variants) || product.variants; // Update variants if provided

        await product.save();
        res.status(200).json({ message: 'Product updated successfully', product });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update product', error });
    }
};
