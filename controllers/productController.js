const Product = require('../models/productModel');
const Shop = require('../models/shopModel');
const path = require("path");
const fs = require('fs/promises');

// Create product with advance money option and multiple images
const createProduct = async (req, res) => {
  let images;
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
    // If product creation fails, handle cleanup if an image was uploaded
    if (images) {
      try {
        await fs.unlink(images);
        console.error(`Deleted orphaned images successfully: ${err.message}`);
      } catch (err) {
        console.error(`Failed to delete orphaned images: ${err.message}`);
      }
    }
    res.status(500).json({ message: 'Failed to create product', error });
  }
};

// Update product with advance money option and multiple images
const updateProduct = async (req, res) => {
  let newImages;
  try {
    const { id } = req.params;
    const { name, description, price, specialPrice, category, subCategory, variants, shop, advanceMoney } = req.body;
    newImages = req.files ? req.files.map(file => file.path) : [];

    console.log("Hitted", id, req.body);
    // Find the existing product
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    console.log("found", product);
    // If a shop is provided, validate the shop
    if (shop) {
      const shopExists = await Shop.findById(shop);
      if (!shopExists) {
        return res.status(404).json({ message: 'Shop not found' });
      }
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
      specialPrice: specialPrice || product.specialPrice,
      category: category || product.category,
      subCategory: subCategory || product.subCategory,
      variants: variants || product.variants,
      images: newImages.length > 0 ? newImages : product.images,
      shop: shop || product.shop,
      advanceMoney: advanceMoney !== undefined ? advanceMoney : product.advanceMoney // Add advanceMoney update if provided
    };

    console.log(updatedFields);

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(id, updatedFields, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Respond with the updated product
    res.status(200).json(updatedProduct);
  } catch (error) {
    if (newImages) {
      try {
        await fs.unlink(newImages);
        console.error(`Deleted orphaned images successfully: ${err.message}`);
      } catch (err) {
        console.error(`Failed to delete orphaned images: ${err.message}`);
      }
    }
    console.error("Error during product update:", error);
    res.status(500).json({ message: 'Failed to update product', error });
  }
};

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('shop'); // Populate shop details
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error });
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
    res.status(500).json({ message: 'Failed to fetch products for this shop', error });
  }
};

// Get single product by ID
const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate('shop'); // Populate shop details

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
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.images.length > 0) {
      const deletePromises = product.images.map(imagePath =>
        fs.unlink(imagePath).catch(err => {
          console.error(`Failed to delete image: ${imagePath}`, err);
        })
      );

      await Promise.all(deletePromises);
      console.log(`Deleted ${product.images.length} images successfully.`);
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({ message: 'Product and associated images deleted successfully' });
  } catch (error) {
    console.error("Error during product deletion:", error);
    res.status(500).json({ message: 'Failed to delete product', error });
  }
};

module.exports = { createProduct, getSingleProduct, getShopProducts, getAllProducts, updateProduct, deleteProduct };
