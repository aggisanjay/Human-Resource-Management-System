const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define('employee_team', {
    assigned_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'employee_teams',
    timestamps: false,
    indexes: [{ unique: true, fields: ['employee_id', 'team_id'] }]
  });
