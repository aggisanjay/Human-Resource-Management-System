const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define('employee', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING
  }, {
    tableName: 'employees',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });
