const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
    type: {
        type: String,
        default: "subCategory"
    },
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    status: {
        type: String,
        default: "pending",
    },
}, { timestamps: true });

const SubCategory = mongoose.model('SubCategory', subCategorySchema);

module.exports = SubCategory;
