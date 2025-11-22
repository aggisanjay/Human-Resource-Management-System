const Sequelize = require('sequelize');
const sequelize = require('../db');

// model imports (factory functions)
const OrganisationModel = require('./organisation');
const UserModel = require('./user');
const EmployeeModel = require('./employee');
const TeamModel = require('./team');
const EmployeeTeamModel = require('./employeeTeam');
const LogModel = require('./log');

// init models
const Organisation = OrganisationModel(sequelize);
const User = UserModel(sequelize);
const Employee = EmployeeModel(sequelize);
const Team = TeamModel(sequelize);
const EmployeeTeam = EmployeeTeamModel(sequelize);
const Log = LogModel(sequelize);

// ==========================
// ASSOCIATIONS (IMPORTANT)
// ==========================

// Organisation → Users
Organisation.hasMany(User, { foreignKey: "organisation_id" });
User.belongsTo(Organisation, { foreignKey: "organisation_id" });

// Organisation → Employees
Organisation.hasMany(Employee, { foreignKey: "organisation_id" });
Employee.belongsTo(Organisation, { foreignKey: "organisation_id" });

// Organisation → Teams
Organisation.hasMany(Team, { foreignKey: "organisation_id" });
Team.belongsTo(Organisation, { foreignKey: "organisation_id" });

// Many-to-many Employee ↔ Team through EmployeeTeam
Employee.belongsToMany(Team, {
  through: EmployeeTeam,
  foreignKey: "employee_id",
  otherKey: "team_id"
});

Team.belongsToMany(Employee, {
  through: EmployeeTeam,
  foreignKey: "team_id",
  otherKey: "employee_id"
});

// Also create direct associations (required for `include`)
EmployeeTeam.belongsTo(Employee, { foreignKey: "employee_id" });
Employee.hasMany(EmployeeTeam, { foreignKey: "employee_id" });

EmployeeTeam.belongsTo(Team, { foreignKey: "team_id" });
Team.hasMany(EmployeeTeam, { foreignKey: "team_id" });

// export everything
module.exports = {
  sequelize,
  Organisation,
  User,
  Employee,
  Team,
  EmployeeTeam,
  Log,
};
