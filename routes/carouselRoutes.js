const express = require('express');
const carouselRoutes = express.Router();
const upload = require('../middlewares/uploadMiddleware');
// Import the controller functions
const { createCarousel, updateCarousel, getCarousel, deleteCarousel } = require('../controllers/carouselController');

carouselRoutes.post('/carousels', upload.single('image'), createCarousel);
carouselRoutes.put('/carousels/update/:id', upload.single('image'), updateCarousel);
carouselRoutes.get('/carousels/:id', getCarousel);
carouselRoutes.delete('/carousels/delete/:id', deleteCarousel);

module.exports = carouselRoutes;
