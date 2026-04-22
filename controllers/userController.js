// const { User } = require('../models');
// const { hashPassword } = require('../helpers/bcrypt');

// exports.getAllUsers = async (req, res, next) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const offset = (page - 1) * limit;
    
//     const { count, rows } = await User.findAndCountAll({
//       attributes: { exclude: ['password'] },
//       limit,
//       offset,
//       order: [['createdAt', 'DESC']]
//     });
    
//     res.json({
//       success: true,
//       data: rows,
//       pagination: {
//         total: count,
//         page: page,
//         totalPages: Math.ceil(count / limit),
//         limit: limit
//       }
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// exports.getUserById = async (req, res, next) => {
//   try {
//     const user = await User.findByPk(req.params.id, {
//       attributes: { exclude: ['password'] }
//     });
    
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }
    
//     res.json({
//       success: true,
//       data: user
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// exports.updateUser = async (req, res, next) => {
//   try {
//     const user = await User.findByPk(req.params.id);
    
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }
    
//     // Cek permission: admin atau user sendiri
//     if (req.user.role !== 'admin' && req.user.id !== user.id) {
//       return res.status(403).json({
//         success: false,
//         message: 'Forbidden: You can only update your own profile'
//       });
//     }
    
//     const { name, email, password, role } = req.body;
    
//     if (name) user.name = name;
//     if (email) user.email = email;
//     if (password) user.password = await hashPassword(password);
    
//     // Hanya admin yang bisa update role
//     if (role && req.user.role === 'admin') {
//       user.role = role;
//     }
    
//     await user.save();
    
//     res.json({
//       success: true,
//       message: 'User updated successfully',
//       data: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: user.role
//       }
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// exports.deleteUser = async (req, res, next) => {
//   try {
//     const user = await User.findByPk(req.params.id);
    
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }
    
//     await user.destroy();
    
//     res.json({
//       success: true,
//       message: 'User deleted successfully'
//     });
//   } catch (error) {
//     next(error);
//   }
// };

const { User } = require('../models');
const { hashPassword } = require('../helpers/bcrypt');

exports.getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const { count, rows } = await User.findAndCountAll({
      attributes: { exclude: ['password'] },
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: page,
        totalPages: Math.ceil(count / limit),
        limit: limit
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Cek permission: admin atau user sendiri
    if (req.user.role !== 'admin' && req.user.id !== user.id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only update your own profile'
      });
    }
    
    const { name, email, password, role } = req.body;
    
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = await hashPassword(password);
    
    // Hanya admin yang bisa update role
    if (role && req.user.role === 'admin') {
      user.role = role;
    }
    
    await user.save();
    
    res.json({
      success: true,
      message: 'User updated successfully',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    await user.destroy();
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};