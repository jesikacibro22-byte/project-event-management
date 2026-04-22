// const { Category } = require('../models');

// exports.getAllCategories = async (req, res, next) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const offset = (page - 1) * limit;
    
//     const { count, rows } = await Category.findAndCountAll({
//       limit,
//       offset,
//       order: [['name', 'ASC']]
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

// exports.getCategoryById = async (req, res, next) => {
//   try {
//     const category = await Category.findByPk(req.params.id);
    
//     if (!category) {
//       return res.status(404).json({
//         success: false,
//         message: 'Category not found'
//       });
//     }
    
//     res.json({
//       success: true,
//       data: category
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// exports.createCategory = async (req, res, next) => {
//   try {
//     const { name, description } = req.body;
    
//     const category = await Category.create({
//       name,
//       description
//     });
    
//     res.status(201).json({
//       success: true,
//       message: 'Category created successfully',
//       data: category
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// exports.updateCategory = async (req, res, next) => {
//   try {
//     const category = await Category.findByPk(req.params.id);
    
//     if (!category) {
//       return res.status(404).json({
//         success: false,
//         message: 'Category not found'
//       });
//     }
    
//     const { name, description } = req.body;
    
//     if (name) category.name = name;
//     if (description !== undefined) category.description = description;
    
//     await category.save();
    
//     res.json({
//       success: true,
//       message: 'Category updated successfully',
//       data: category
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// exports.deleteCategory = async (req, res, next) => {
//   try {
//     const category = await Category.findByPk(req.params.id);
    
//     if (!category) {
//       return res.status(404).json({
//         success: false,
//         message: 'Category not found'
//       });
//     }
    
//     await category.destroy();
    
//     res.json({
//       success: true,
//       message: 'Category deleted successfully'
//     });
//   } catch (error) {
//     next(error);
//   }
// };

const { Category } = require('../models');
const { Op } = require('sequelize');  // ← Tambahkan ini di atas

// GET semua categories dengan pencarian & filter
exports.getAllCategories = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';  
    
    // membuat kondisi WHERE untuk pencarian
    const where = {};
    
    // Jika ada kata kunci pencarian/menggunakan queri
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }
    
    const { count, rows } = await Category.findAndCountAll({
      where: where,  
      limit,
      offset,
      order: [['name', 'ASC']]
    });
    
    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: page,
        totalPages: Math.ceil(count / limit),
        limit: limit
      },
      filters: {  
        search: search || null
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET categories berdasarkan Id
exports.getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// POST untuk membuat categories
exports.createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    
    const category = await Category.create({
      name,
      description
    });
    
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// Update categories
exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    const { name, description } = req.body;
    
    if (name) category.name = name;
    if (description !== undefined) category.description = description;
    
    await category.save();
    
    res.json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// DELETE categories
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    await category.destroy();
    
    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};