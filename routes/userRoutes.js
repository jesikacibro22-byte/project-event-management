const express = require('express');
const { verifyToken } = require('../middlewares/auth');
const { checkRole } = require('../middlewares/roleCheck');
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/userController');
const router = express.Router();

router.get('/', verifyToken, checkRole(['admin']), getAllUsers);
router.get('/:id', verifyToken, getUserById);
router.put('/:id', verifyToken, updateUser);
router.delete('/:id', verifyToken, checkRole(['admin']), deleteUser);

module.exports = router;