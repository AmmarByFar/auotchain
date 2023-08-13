import Sequelize from 'sequelize';

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;

export default new Sequelize('autochain', dbUser, dbPassword, {
  host: dbHost,
  dialect: 'mysql'
});