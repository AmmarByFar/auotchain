const Sequelize = require('sequelize');
const db = require('../config/database');
const User = require('./models/User'); // make sure this path is correct

const Product = db.define('Product', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    productId: {
      type: Sequelize.STRING,
      allowNull: false
    },
    supplierId: {
      type: Sequelize.INTEGER,
      references: {
        model: User, // Now 'User' model is referred instead of 'suppliers'
        key: 'id',
      },
      allowNull: false
    },
    warehouseId: {
      type: Sequelize.INTEGER,
      references: {
        model: User, // 'User' model is referred
        key: 'id',
      },
      allowNull: true // Assuming a warehouse manager is optional for a product
    }
}, {
    tableName: 'products',
    uniqueKeys: {
      unique_tag: {
        fields: ['productId', 'supplierId', 'warehouseId']
      }
    }
});

Product.belongsTo(User, {as: 'Supplier', foreignKey: 'supplierId'});
Product.belongsTo(User, {as: 'WarehouseManager', foreignKey: 'warehouseId'});

module.exports = Product;