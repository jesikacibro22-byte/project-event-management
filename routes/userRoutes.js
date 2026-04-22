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

/**
 * ===============================
 * PUBLIC ROUTES (tanpa token)
 * ===============================
 */

// Bisa diakses langsung dari browser (untuk demo)
router.get('/public', getAllUsers);


/**
 * ===============================
 * PRIVATE ROUTES (pakai token)
 * ===============================
 */

// Ambil semua user (khusus admin)
router.get('/', verifyToken, checkRole(['admin']), getAllUsers);

// Ambil user berdasarkan ID (harus login)
router.get('/:id', verifyToken, getUserById);

// Update user (user sendiri / admin)
router.put('/:id', verifyToken, updateUser);

// Hapus user (khusus admin)
router.delete('/:id', verifyToken, checkRole(['admin']), deleteUser);

module.exports = router;