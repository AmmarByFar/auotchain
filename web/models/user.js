import Sequelize from 'sequelize';
import db from '../config/database.js';
import bcrypt from 'bcrypt';

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
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  hooks: {
    beforeCreate: async (user) => {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(user.password, saltRounds);
      user.password = hashedPassword;
    }
  }
});

export default User;