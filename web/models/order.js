import Sequelize from 'sequelize';
import db from '../config/database.js';
import User from './user.js'; 

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
  orderNotes: {
    type: Sequelize.STRING,
    allowNull: true
  }
});

Order.belongsTo(User, {as: 'Supplier', foreignKey: 'supplierID'});
Order.belongsTo(User, {as: 'WarehouseManager', foreignKey: 'warehouseManagerID'});

export default Order;