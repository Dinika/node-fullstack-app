const Sequelize = require('sequelize')

const sequelize = new Sequelize(
  'node-complete',
  'root',
  'MPsdshdc@174',
  {
    dialect: 'mysql',
    host: 'localhost'
  }
)

module.exports = sequelize