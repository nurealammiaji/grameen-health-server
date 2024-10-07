const mongoose = require('mongoose');

const carouselSchema = new mongoose.Schema({
    type: {
        type: String,
        default: "carousel"
    },
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: null
    },
    destination: {
        type: String,
        default: "/",
        trim: true,
    },
    status: {
        type: String,
        default: "active"
    }
}, { timestamps: true });

const Carousel = mongoose.model('Carousel', carouselSchema);

module.exports = Carousel;
