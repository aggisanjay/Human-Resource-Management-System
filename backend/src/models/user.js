const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define('user', {
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password_hash: { type: DataTypes.STRING, allowNull: false },
    name: DataTypes.STRING,
    is_admin: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });
