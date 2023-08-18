import Sequelize from 'sequelize';
import db from '../config/database.js';
import Order from './order.js';

const Invoice = db.define('Invoice', {
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
  invoiceAmount: {
    type: Sequelize.STRING,
    allowNull: false
  },
  invoiceDate: {
    type: Sequelize.DATE,
    allowNull: true
  },
  filePath: { 
    type: Sequelize.STRING,
    allowNull: true
  }
});

Invoice.belongsTo(Order, {foreignKey: 'orderID'});

export default Invoice;