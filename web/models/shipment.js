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
  shipmentTracking: {
    type: Sequelize.STRING,
    allowNull: true
  },
  shipmentDate: {
    type: Sequelize.DATE,
    allowNull: true
  },
  expectedArrivalDate: {
    type: Sequelize.DATE,
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

Shipment.belongsTo(Order, {foreignKey: 'orderID'});

export default Shipment;