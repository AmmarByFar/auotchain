import Sequelize from 'sequelize';
import db from '../config/database.js';

const ShopifySession = db.define('shopify_sessions', {
  id: {
    type: Sequelize.STRING(255),
    primaryKey: true,
    allowNull: false
  },
  shop: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  state: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  isOnline: {
    type: Sequelize.TINYINT,
    allowNull: false
  },
  scope: {
    type: Sequelize.STRING(1024),
    allowNull: false
  },
  expires: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  onlineAccessInfo: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  accessToken: {
    type: Sequelize.STRING(255),
    allowNull: false
  }
}, {
  timestamps: false,
  freezeTableName: true
});

export default ShopifySession;