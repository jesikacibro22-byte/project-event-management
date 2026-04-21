const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  price: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  quota: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  remainingQuota: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'events'
});

module.exports = Event;