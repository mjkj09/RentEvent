const router = require('express').Router();
const ctrl = require('../controllers/review.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.get('/', ctrl.getAllReviews);
router.get('/:id', ctrl.getReviewById);
router.post('/', verifyToken, ctrl.createReview);

//TODO: Add additional logic to check if user is the author of the review
router.put('/:id', verifyToken, ctrl.updateReview);
router.delete('/:id', verifyToken, ctrl.deleteReview);

module.exports = router;