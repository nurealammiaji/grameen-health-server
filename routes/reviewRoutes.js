const express = require('express');
const reviewRoutes = express.Router();
const { createReview, updateReview, getSingleReview, getAllReviews, getReviewsByProductId, getReviewsByUserId, getReviewsByOrderId, deleteReview } = require('../controllers/reviewController');
const upload = require('../middlewares/uploadMiddleware');

reviewRoutes.post('/reviews/create', upload.array('images[]', 5), createReview);
reviewRoutes.put('/reviews/update/:id', upload.array('images[]', 5), updateReview);
reviewRoutes.get('/reviews/read/:id', getSingleReview);
reviewRoutes.get('/reviews/read', getAllReviews);
reviewRoutes.get('/reviews/read/products/:productId', getReviewsByProductId);
reviewRoutes.get('/reviews/read/users/:userId', getReviewsByUserId);
reviewRoutes.get('/reviews/read/orders/:orderId', getReviewsByOrderId);
reviewRoutes.delete('/reviews/delete/:id', deleteReview);

module.exports = reviewRoutes;