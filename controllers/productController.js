const Product = require('../models/productModel');
const path = require('path');

// Create product with multiple images
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, subCategory, variants } = req.body;
    const images = req.files.map(file => file.path);

    console.log({ name, description, price, category, variants });

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      subCategory,
      variants,
      images
    });

    console.log(newProduct);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to create product', error });
  }
};

// Update product with multiple images
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, variants } = req.body;
    const images = req.files.map(file => file.path);

    console.log({ name, description, price, category, variants });

    const updatedProduct = await Product.findByIdAndUpdate(id, {
      name,
      description,
      price,
      category,
      variants,
      images
    }, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
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

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    console.log(id, deletedProduct);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product', error });
  }
};

module.exports = { createProduct, getSingleProduct, getAllProducts, updateProduct, deleteProduct };