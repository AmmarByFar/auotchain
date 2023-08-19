import Sequelize from 'sequelize';
import db from '../config/database.js';

const AppSettings = db.define('AppSettings', {
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
  },
  reorderAmount: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  startDate: {
    type: Sequelize.DATE,
    allowNull: true
  },
  trackingEnabled: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
});

export default AppSettings;