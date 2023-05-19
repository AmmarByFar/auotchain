import Sequelize from 'sequelize';
import db from '../config/database.js';

const User = db.define('User', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  shopDomain: {
    type: Sequelize.STRING
  },
  userRole: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

export default User;