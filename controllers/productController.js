const Product = require('../models/productModel');

// Create a new product with image upload
const createProduct = async (req, res) => {
    try {
        const { name, description, price, variants } = req.body;

        // Set the product image to null if no file is uploaded
        const productImage = req.file ? req.file.filename : null;

        // Handle variants images
        const variantsWithImages = variants ? JSON.parse(variants).map((variant, index) => {
            return {
                ...variant,
                variantImage: req.files && req.files[`variantImage_${index}`] ? req.files[`variantImage_${index}`][0].filename : null,
            };
        }) : [];

        const product = new Product({
            name,
            description,
            price,
            image: productImage,
            variants: variantsWithImages,
        });

        await product.save();
        res.status(201).json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error });
    }
};

// Delete a product by ID
const deleteProduct = async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      // Optionally delete the product image from the server if needed
      // fs.unlinkSync(`path/to/uploads/${product.image}`);
      res.status(200).json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error });
    }
  };
  

module.exports = { createProduct, deleteProduct };