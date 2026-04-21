const sequelize = require('../config/database');
const User = require('./User');
const Category = require('./category');
const Event = require('./event');
const Booking = require('./Booking');
const Review = require('./Review');

// Relasi User
User.hasMany(Booking, { foreignKey: 'userId' });
Booking.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Review, { foreignKey: 'userId' });
Review.belongsTo(User, { foreignKey: 'userId' });

// Relasi Category
Category.hasMany(Event, { foreignKey: 'categoryId' });
Event.belongsTo(Category, { foreignKey: 'categoryId' });

// Relasi Event
Event.hasMany(Booking, { foreignKey: 'eventId' });
Booking.belongsTo(Event, { foreignKey: 'eventId' });

Event.hasMany(Review, { foreignKey: 'eventId' });
Review.belongsTo(Event, { foreignKey: 'eventId' });

module.exports = {
  sequelize,
  User,
  Category,
  Event,
  Booking,
  Review
};