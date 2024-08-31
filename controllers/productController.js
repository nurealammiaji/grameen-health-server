const path = require('path');
const fs = require('fs');
const Product = require('../models/productModel');
const { uploadFile, deleteFile } = require('../configs/ftpClient');

// Create a new product
const createProduct = async (req, res) => {
    try {
        const { name, price, description, variants } = req.body;
        const files = req.files;
        let imagePaths = [];

        if (files) {
            // Upload each file via FTP
            for (const file of files) {
                const localPath = file.path;
                const remotePath = `uploads/${path.basename(file.path)}`;
                await uploadFile(localPath, remotePath);
                imagePaths.push(remotePath); // Store the remote path
            }
        }

        const product = new Product({
            name,
            price,
            description,
            images: imagePaths,
            variants: JSON.parse(variants) // Parse JSON string of variants
        });

        await product.save();
        res.status(201).json({ message: 'Product created successfully', product });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create product', error });
    } finally {
        // Clean up local files after upload
        if (files) {
            files.forEach(file => fs.unlinkSync(file.path));
        }
    }
};

// Get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch products', error });
    }
};

// Get a product by ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch product', error });
    }
};

// Update a product by ID
const updateProduct = async (req, res) => {
    try {
        const { name, price, description, variants } = req.body;
        const files = req.files;
        let imagePaths = [];

        if (files) {
            // Upload new images via FTP
            for (const file of files) {
                const localPath = file.path;
                const remotePath = `uploads/${path.basename(file.path)}`;
                await uploadFile(localPath, remotePath);
                imagePaths.push(remotePath);
            }
        }

        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Update fields
        product.name = name || product.name;
        product.price = price || product.price;
        product.description = description || product.description;
        if (imagePaths.length) {
            // Optionally delete old images from FTP
            for (const oldPath of product.images) {
                await deleteFile(oldPath);
            }
            product.images = imagePaths; // Update images
        }
        product.variants = JSON.parse(variants) || product.variants;

        await product.save();
        res.status(200).json({ message: 'Product updated successfully', product });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update product', error });
    } finally {
        // Clean up local files after upload
        if (files) {
            files.forEach(file => fs.unlinkSync(file.path));
        }
    }
};

// Delete a product by ID
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Delete associated images from FTP
        for (const imagePath of product.images) {
            await deleteFile(imagePath);
        }

        await product.remove();
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete product', error });
    }
};

module.exports = { createProduct, getProductById, getAllProducts, updateProduct, deleteProduct };