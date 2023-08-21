import Sequelize from 'sequelize';
import db from '../config/database.js';

const Shipment = db.define('Shipment', {
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
    type: Sequelize.INTEGER,
    allowNull: true
  },
  tracking: {
    type: Sequelize.STRING,
    allowNull: true
  },
  status: {
    type: Sequelize.STRING,
    allowNull: true
  },
  notes: {
    type: Sequelize.STRING,
    allowNull: true
  }
});

export default Shipment;