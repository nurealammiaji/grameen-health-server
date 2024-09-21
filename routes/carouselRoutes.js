const express = require('express');
const carouselRoutes = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const { createCarousel, updateCarousel, getCarousel, deleteCarousel, getAllCarousels } = require('../controllers/carouselController');

carouselRoutes.post('/carousels/create', upload.single('image'), createCarousel);
carouselRoutes.put('/carousels/update/:id', upload.single('image'), updateCarousel);
carouselRoutes.get('/carousels/read/:id', getCarousel);
carouselRoutes.get('/carousels/read', getAllCarousels);
carouselRoutes.delete('/carousels/delete/:id', deleteCarousel);

module.exports = carouselRoutes;
