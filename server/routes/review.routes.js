// Updated server/routes/review.routes.js
const router = require('express').Router();
const reviewController = require('../controllers/review.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { validateReview } = require('../middleware/validation.middleware');

// Public routes
router.get('/', reviewController.getAllReviews);
router.get('/:id', reviewController.getReviewById);
router.get('/venue/:venueId', reviewController.getVenueReviews);

// Protected routes
router.post('/', verifyToken, validateReview, reviewController.createReview);
router.put('/:id', verifyToken, validateReview, reviewController.updateReview);
router.delete('/:id', verifyToken, reviewController.deleteReview);

module.exports = router;