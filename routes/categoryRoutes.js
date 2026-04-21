const express = require('express');
const { verifyToken } = require('../middlewares/auth');
const { checkRole } = require('../middlewares/roleCheck');
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validate');
const router = express.Router();

router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.post('/',
  verifyToken,
  checkRole(['admin']),
  [body('name').notEmpty().withMessage('Category name is required')],
  validate,
  createCategory
);
router.put('/:id',
  verifyToken,
  checkRole(['admin']),
  updateCategory
);
router.delete('/:id',
  verifyToken,
  checkRole(['admin']),
  deleteCategory
);

module.exports = router;