const Product = require('../models/productModel');
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

// Create product with advance money option and multiple images
const createProduct = async (req, res) => {
  let images = [];
  try {
    const { name, description, price, specialPrice, category, subCategory, variants, shop, advanceMoney } = req.body;
    images = req.files ? req.files.map(file => file.path) : [];

    // Validate the shop
    const shopExists = await Shop.findById(shop);
    if (!shopExists) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      specialPrice,
      category,
      subCategory,
      variants,
      images,
      shop,
      advanceMoney
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    if (images) {
      await deleteFiles(images);
    }
    console.error('Failed to create product:', error);
    res.status(500).json({ message: 'Failed to create product', error: error.message });
  }
};

// Update product
const updateProduct = async (req, res) => {
  let newImages = [];
  try {
    const { id } = req.params;
    const { name, description, price, specialPrice, category, subCategory, variants, shop, advanceMoney } = req.body;
    newImages = req.files ? req.files.map(file => file.path) : [];

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Validate the shop if provided
    if (shop) {
      const shopExists = await Shop.findById(shop);
      if (!shopExists) {
        return res.status(404).json({ message: 'Shop not found' });
      }
    }

    // Determine images to delete
    const imagesToDelete = product.images.filter(imagePath => !newImages.includes(imagePath));
    await deleteFiles(imagesToDelete);

    // Prepare fields to update
    const updatedFields = {
      name: name || product.name,
      description: description || product.description,
      price: price || product.price,
      specialPrice: specialPrice || product.specialPrice,
      category: category || product.category,
      subCategory: subCategory || product.subCategory,
      variants: variants || product.variants,
      images: newImages.length > 0 ? newImages : product.images,
      shop: shop || product.shop,
      advanceMoney: advanceMoney !== undefined ? advanceMoney : product.advanceMoney
    };

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedFields, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    if (newImages) {
      await deleteFiles(newImages);
    }
    console.error('Failed to update product:', error);
    res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
};

// Get single product by ID
const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate('shop');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('Failed to fetch product:', error);
    res.status(500).json({ message: 'Failed to fetch product', error: error.message });
  }
};

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('shop');
    res.status(200).json(products);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
};

// Get products for a specific shop
const getShopProducts = async (req, res) => {
  try {
    const { shopId } = req.params;
    const products = await Product.find({ shop: shopId }).populate('shop');

    if (!products.length) {
      return res.status(404).json({ message: 'No products found for this shop' });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error('Failed to fetch products for this shop:', error);
    res.status(500).json({ message: 'Failed to fetch products for this shop', error: error.message });
  }
};

// Get products by category
const getCategoryProducts = async (req, res) => {
  try {
    const { category } = req.params;

    const products = await Product.find({ category }).populate('shop');

    if (!products.length) {
      return res.status(404).json({ message: 'No products found for this category' });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error('Failed to fetch products by category:', error);
    res.status(500).json({ message: 'Failed to fetch products by category', error: error.message });
  }
};

// Get products by subcategory
const getSubCategoryProducts = async (req, res) => {
  try {
    const { subCategory } = req.params;

    const products = await Product.find({ subCategory }).populate('shop');

    if (!products.length) {
      return res.status(404).json({ message: 'No products found for this subcategory' });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error('Failed to fetch products by subcategory:', error);
    res.status(500).json({ message: 'Failed to fetch products by subcategory', error: error.message });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await deleteFiles(product.images);
    await Product.findByIdAndDelete(id);

    res.status(200).json({ message: 'Product and associated images deleted successfully' });
  } catch (error) {
    console.error('Failed to delete product:', error);
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
};

module.exports = { createProduct, getSingleProduct, getShopProducts, getCategoryProducts, getSubCategoryProducts, getAllProducts, updateProduct, deleteProduct };
