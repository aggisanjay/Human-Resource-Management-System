const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define('team', {
    name: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.TEXT
  }, {
    tableName: 'teams',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });
