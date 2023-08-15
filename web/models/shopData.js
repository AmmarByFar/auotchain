import Sequelize from 'sequelize';
import db from '../config/database.js';

const ShopData = db.define('ShopData', {
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
    lastSaleProcessed: {
      type: Sequelize.DATE,
      allowNull: true
    },
    lastPOProcessed: {
        type: Sequelize.DATE,
        allowNull: true
    }
});

export default ShopData;