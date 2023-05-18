const Sequelize = require('sequelize');
const db = require('../config/database');
const User = require('./models/User'); // make sure this path is correct

const Order = db.define('Order', {
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
  productID: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  SKU: {
    type: Sequelize.STRING,
    allowNull: false
  },
  orderAmount: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  supplierID: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  warehouseManagerID: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  orderStatus: {
    type: Sequelize.STRING,
    allowNull: true
  },
  orderDate: {
    type: Sequelize.DATE,
    allowNull: true
  },
  deliveryDate: {
    type: Sequelize.DATE,
    allowNull: true
  },
  deliveryTracking: {
    type: Sequelize.STRING,
    allowNull: true
  },
  deliveryNotes: {
    type: Sequelize.STRING,
    allowNull: true
  }
});

Order.belongsTo(User, {as: 'Supplier', foreignKey: 'supplierID'});
Order.belongsTo(User, {as: 'WarehouseManager', foreignKey: 'warehouseManagerID'});

module.exports = Order;