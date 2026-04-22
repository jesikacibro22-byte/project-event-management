// const express = require('express');
// const { verifyToken } = require('../middlewares/auth');
// const { checkRole } = require('../middlewares/roleCheck');
// const {
//   getAllUsers,
//   getUserById,
//   updateUser,
//   deleteUser
// } = require('../controllers/userController');
// const router = express.Router();

// router.get('/', verifyToken, checkRole(['admin']), getAllUsers);
// router.get('/:id', verifyToken, getUserById);
// router.put('/:id', verifyToken, updateUser);
// router.delete('/:id', verifyToken, checkRole(['admin']), deleteUser);

// module.exports = router;

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

router.get('/public', getAllUsers);

router.get('/', verifyToken, checkRole(['admin']), getAllUsers);

// Ambil user berdasarkan ID (harus login terlebih dahulu)
router.get('/:id', verifyToken, getUserById);

// Update user (ini bisa dari akun user / admin)
router.put('/:id', verifyToken, updateUser);

// Hapus user (khusus admin saja yang bisa menghapus users nya)
router.delete('/:id', verifyToken, checkRole(['admin']), deleteUser);

module.exports = router;