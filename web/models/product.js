import Sequelize from 'sequelize';
import db from '../config/database.js';
import User from './user.js'; // make sure this path is correct

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
      allowNull: true
    },
    warehouseId: {
      type: Sequelize.INTEGER,
      references: {
        model: User, // 'User' model is referred
        key: 'id',
      },
      allowNull: true // Assuming a warehouse manager is optional for a product
    },
    sku: {
      type: Sequelize.STRING,
      allowNull: true
    },
    onHand: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    shopDomain: {
      type: Sequelize.STRING,
      allowNull: false
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

export default Product;