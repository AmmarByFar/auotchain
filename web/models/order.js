import Sequelize from 'sequelize';
import db from '../config/database.js';
import User from './user.js'; 
import OrderItem from './orderItem.js'

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
  supplierID: {
    type: Sequelize.INTEGER,
    allowNull: true
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

export default Order;