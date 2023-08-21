import Sequelize from 'sequelize';
import db from '../config/database.js';

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
  amount: {
    type: Sequelize.DECIMAL,
    allowNull: false
  },
  date: {
    type: Sequelize.DATE,
    allowNull: true
  },
  filePath: { 
    type: Sequelize.STRING,
    allowNull: true
  }
});

export default Invoice;