const { Booking, Event, User, sequelize } = require('../models');

exports.createBooking = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { eventId, quantity } = req.body;
    
    const event = await Event.findByPk(eventId, { transaction });
    
    if (!event) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    if (quantity <= 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }
    
    if (event.remainingQuota < quantity) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: `Insufficient quota. Only ${event.remainingQuota} left`
      });
    }
    
    const totalPrice = quantity * event.price;
    
    const booking = await Booking.create({
      userId: req.user.id,
      eventId,
      quantity,
      totalPrice,
      status: 'pending'
    }, { transaction });
    
    // Quota belum dikurangi sampai confirmed
    
    await transaction.commit();
    
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

exports.getMyBookings = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const { count, rows } = await Booking.findAndCountAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Event,
          attributes: ['id', 'title', 'date', 'location', 'price']
        }
      ],
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

exports.getAllBookings = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const { count, rows } = await Booking.findAndCountAll({
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email']
        },
        {
          model: Event,
          attributes: ['id', 'title', 'date']
        }
      ],
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

exports.updateBookingStatus = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  
  try {
    const booking = await Booking.findByPk(req.params.id, { transaction });
    
    if (!booking) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    const { status } = req.body;
    
    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be pending, confirmed, or cancelled'
      });
    }
    
    const event = await Event.findByPk(booking.eventId, { transaction });
    
    // Jika status berubah menjadi confirmed
    if (status === 'confirmed' && booking.status !== 'confirmed') {
      if (event.remainingQuota < booking.quantity) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: `Insufficient quota. Only ${event.remainingQuota} left`
        });
      }
      event.remainingQuota -= booking.quantity;
      await event.save({ transaction });
    }
    
    // Jika status berubah menjadi cancelled dan sebelumnya confirmed
    if (status === 'cancelled' && booking.status === 'confirmed') {
      event.remainingQuota += booking.quantity;
      await event.save({ transaction });
    }
    
    // Jika status berubah dari confirmed ke pending (kembalikan quota)
    if (status === 'pending' && booking.status === 'confirmed') {
      event.remainingQuota += booking.quantity;
      await event.save({ transaction });
    }
    
    booking.status = status;
    await booking.save({ transaction });
    
    await transaction.commit();
    
    res.json({
      success: true,
      message: `Booking status updated to ${status}`,
      data: booking
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

exports.deleteBooking = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  
  try {
    const booking = await Booking.findByPk(req.params.id, { transaction });
    
    if (!booking) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    // Hanya bisa delete booking dengan status pending
    if (booking.status !== 'pending') {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Only pending bookings can be deleted'
      });
    }
    
    // Cek permission: ini bisa user sendiri atau admin
    if (req.user.role !== 'admin' && req.user.id !== booking.userId) {
      await transaction.rollback();
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only delete your own bookings'
      });
    }
    
    await booking.destroy({ transaction });
    await transaction.commit();
    
    res.json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};