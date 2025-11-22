const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define('log', {
    organisation_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    action: DataTypes.STRING,
    meta: DataTypes.JSONB,
    timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'logs',
    timestamps: false
  });
