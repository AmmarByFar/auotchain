import Sequelize from 'sequelize';
import db from '../config/database.js';
import Order from './order.js'; 

const OrderItem = db.define('OrderItem', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    orderID: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Orders',
        key: 'id'
      }
    },
    productID: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    SKU: {
      type: Sequelize.STRING,
      allowNull: false
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  });

  export default OrderItem;