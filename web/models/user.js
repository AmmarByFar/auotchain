const Sequelize = require('sequelize');
const db = require('../config/database');

const User = db.define('User', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  shopDomain: {
    type: Sequelize.STRING
  },
  userRole: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = User;
