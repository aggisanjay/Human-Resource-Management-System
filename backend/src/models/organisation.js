const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define('organisation', {
    name: { type: DataTypes.STRING, allowNull: false }
  }, {
    tableName: 'organisations',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });
