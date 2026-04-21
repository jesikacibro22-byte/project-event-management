const express = require('express');
const { verifyToken } = require('../middlewares/auth');
const { checkRole } = require('../middlewares/roleCheck');
const {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
  deleteBooking
} = require('../controllers/bookingController');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validate');
const router = express.Router();

router.post('/',
  verifyToken,
  [
    body('eventId').isInt().withMessage('Valid event ID is required'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
  ],
  validate,
  createBooking
);
router.get('/my-bookings', verifyToken, getMyBookings);
router.get('/', verifyToken, checkRole(['admin']), getAllBookings);
router.put('/:id/status',
  verifyToken,
  checkRole(['admin']),
  [
    body('status').isIn(['pending', 'confirmed', 'cancelled']).withMessage('Invalid status')
  ],
  validate,
  updateBookingStatus
);
router.delete('/:id', verifyToken, deleteBooking);

module.exports = router;