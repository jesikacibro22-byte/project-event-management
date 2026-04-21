const { Event, Category } = require('../models');
const { Op } = require('sequelize');

exports.getAllEvents = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const { category_id, search, min_price, max_price } = req.query;
    
    const where = {};
    
    if (category_id) {
      where.categoryId = parseInt(category_id);
    }
    
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { location: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }
    
    if (min_price) {
      where.price = { [Op.gte]: parseInt(min_price) };
    }
    
    if (max_price) {
      where.price = { ...where.price, [Op.lte]: parseInt(max_price) };
    }
    
    const { count, rows } = await Event.findAndCountAll({
      where,
      include: [
        {
          model: Category,
          attributes: ['id', 'name']
        }
      ],
      limit,
      offset,
      order: [['date', 'ASC']]
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

exports.getEventById = async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id, {
      include: [
        {
          model: Category,
          attributes: ['id', 'name', 'description']
        }
      ]
    });
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    next(error);
  }
};

exports.createEvent = async (req, res, next) => {
  try {
    const { title, description, location, date, price, quota, categoryId } = req.body;
    
    const event = await Event.create({
      title,
      description,
      location,
      date,
      price: price || 0,
      quota,
      remainingQuota: quota, // Sama dengan quota awal
      categoryId
    });
    
    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event
    });
  } catch (error) {
    next(error);
  }
};

exports.updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    const { title, description, location, date, price, quota, categoryId } = req.body;
    
    if (title) event.title = title;
    if (description !== undefined) event.description = description;
    if (location) event.location = location;
    if (date) event.date = date;
    if (price !== undefined) event.price = price;
    if (quota) {
      const selisih = quota - event.quota;
      event.quota = quota;
      event.remainingQuota += selisih;
    }
    if (categoryId) event.categoryId = categoryId;
    
    await event.save();
    
    res.json({
      success: true,
      message: 'Event updated successfully',
      data: event
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    await event.destroy();
    
    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};