const Product = require('../models/productModel');
const path = require("path");
const fs = require('fs').promises;

// Create product with multiple images
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, subCategory, variants } = req.body;
    const images = req.files.map(file => file.path);

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      subCategory,
      variants,
      images
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create product', error });
  }
};

// Update product with multiple images
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category, variants } = req.body;
  const newImages = req.files ? req.files.map(file => file.path) : []; // Handle uploaded images

  try {
    // Find the existing product
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Determine images to delete (those not in the new images list)
    const imagesToDelete = product.images.filter(imagePath => !newImages.includes(imagePath));

    // Delete old images
    await Promise.all(imagesToDelete.map(imagePath =>
      fs.unlink(imagePath).catch(err => console.error(`Failed to delete image: ${imagePath}`, err))
    ));

    // Prepare fields to update
    const updatedFields = {
      name: name || product.name,
      description: description || product.description,
      price: price || product.price,
      category: category || product.category,
      variants: variants || product.variants,
      images: newImages.length > 0 ? newImages : product.images
    };

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(id, updatedFields, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Respond with the updated product
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error during product update:", error);
    res.status(500).json({ message: 'Failed to update product', error });
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

// Get single product by ID
const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch product', error });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the product to delete
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete image files from the server
    if (product.images.length > 0) {
      const deletePromises = product.images.map(imagePath =>
        fs.unlink(imagePath).catch(err => {
          console.error(`Failed to delete image: ${imagePath}`, err);
        })
      );

      await Promise.all(deletePromises);
      console.log(`Deleted ${product.images.length} images successfully.`);
    }

    // Delete product from the database
    await Product.findByIdAndDelete(id);

    res.status(200).json({ message: 'Product and associated images deleted successfully' });
  } catch (error) {
    console.error("Error during product deletion:", error);
    res.status(500).json({ message: 'Failed to delete product', error });
  }
};


module.exports = { createProduct, getSingleProduct, getAllProducts, updateProduct, deleteProduct };