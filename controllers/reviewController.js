const { Review, Event, Booking, User } = require('../models');
const { Op } = require('sequelize');

exports.createReview = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { rating, comment } = req.body;
    
    // Cek apakah event ada
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    // Cek apakah user sudah pernah booking event ini dengan status confirmed
    const booking = await Booking.findOne({
      where: {
        userId: req.user.id,
        eventId: eventId,
        status: 'confirmed'
      }
    });
    
    if (!booking) {
      return res.status(403).json({
        success: false,
        message: 'You can only review events that you have attended (confirmed booking)'
      });
    }
    
    // Cek apakah user sudah pernah review event ini
    const existingReview = await Review.findOne({
      where: {
        userId: req.user.id,
        eventId: eventId
      }
    });
    
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this event'
      });
    }
    
    const review = await Review.create({
      userId: req.user.id,
      eventId: parseInt(eventId),
      rating,
      comment
    });
    
    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: review
    });
  } catch (error) {
    next(error);
  }
};

exports.getEventReviews = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    const { count, rows } = await Review.findAndCountAll({
      where: { eventId: eventId },
      include: [
        {
          model: User,
          attributes: ['id', 'name']
        }
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });
    
    // Hitung rata-rata rating
    const sumRating = rows.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = rows.length > 0 ? (sumRating / rows.length).toFixed(1) : 0;
    
    res.json({
      success: true,
      data: {
        reviews: rows,
        averageRating: parseFloat(averageRating),
        totalReviews: count
      },
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

exports.updateReview = async (req, res, next) => {
  try {
    const review = await Review.findByPk(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    // Hanya user yang membuat review yang bisa update
    if (req.user.role !== 'admin' && req.user.id !== review.userId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only update your own reviews'
      });
    }
    
    const { rating, comment } = req.body;
    
    if (rating) review.rating = rating;
    if (comment !== undefined) review.comment = comment;
    
    await review.save();
    
    res.json({
      success: true,
      message: 'Review updated successfully',
      data: review
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByPk(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    // User sendiri atau admin yang bisa hapus
    if (req.user.role !== 'admin' && req.user.id !== review.userId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only delete your own reviews'
      });
    }
    
    await review.destroy();
    
    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};