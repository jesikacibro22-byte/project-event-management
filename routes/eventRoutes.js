const express = require('express');
const { verifyToken } = require('../middlewares/auth');
const { checkRole } = require('../middlewares/roleCheck');
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validate');
const router = express.Router();

router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.post('/',
  verifyToken,
  checkRole(['admin']),
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('location').notEmpty().withMessage('Location is required'),
    body('date').isISO8601().withMessage('Valid date is required'),
    body('quota').isInt({ min: 1 }).withMessage('Quota must be at least 1')
  ],
  validate,
  createEvent
);
router.put('/:id',
  verifyToken,
  checkRole(['admin']),
  updateEvent
);
router.delete('/:id',
  verifyToken,
  checkRole(['admin']),
  deleteEvent
);

module.exports = router;