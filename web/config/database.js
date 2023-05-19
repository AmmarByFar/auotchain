import Sequelize from 'sequelize';

export default new Sequelize('autochain', 'root', 'ama4life1992', {
  host: '192.168.4.221',
  dialect: 'mysql'
});