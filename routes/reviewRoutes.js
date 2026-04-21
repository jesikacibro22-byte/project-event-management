const express = require('express');
const { verifyToken } = require('../middlewares/auth');
const {
  createReview,
  getEventReviews,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validate');
const router = express.Router();

router.post('/events/:eventId/reviews',
  verifyToken,
  [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').optional()
  ],
  validate,
  createReview
);
router.get('/events/:eventId/reviews', getEventReviews);
router.put('/reviews/:id',
  verifyToken,
  [
    body('rating').optional().isInt({ min: 1, max: 5 }),
    body('comment').optional()
  ],
  validate,
  updateReview
);
router.delete('/reviews/:id', verifyToken, deleteReview);

module.exports = router;