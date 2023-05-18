const Sequelize = require('sequelize');
const db = require('../config/database');

const UserSettings = db.define('UserSettings', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  shopDomain: {
    type: Sequelize.STRING,
    allowNull: false
  },
  reorderLevel: {
    type: Sequelize.INTEGER,
    allowNull: true
  }
});

module.exports = UserSettings;