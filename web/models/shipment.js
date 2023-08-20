import Sequelize from 'sequelize';
import db from '../config/database.js';
import Order from './order.js'; 

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
  shipmentAmount: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  shipmentTracking: {
    type: Sequelize.STRING,
    allowNull: true
  },
  shipmentStatus: {
    type: Sequelize.STRING,
    allowNull: true
  },
  shipmentNotes: {
    type: Sequelize.STRING,
    allowNull: true
  }
});

Shipment.belongsTo(Order, {foreignKey: 'orderID'});

export default Shipment;