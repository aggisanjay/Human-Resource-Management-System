const { Team, Employee, EmployeeTeam, Log } = require('../models');

exports.listTeams = async (req, res) => {
  const orgId = req.user.orgId;
  const teams = await Team.findAll({ where: { organisation_id: orgId }});
  res.json(teams);
};

exports.createTeam = async (req, res) => {
  const orgId = req.user.orgId;
  const team = await Team.create({ ...req.body, organisation_id: orgId });
  await Log.create({ organisation_id: orgId, user_id: req.user.userId, action: 'team_created', meta: { teamId: team.id }});
  res.status(201).json(team);
};

exports.updateTeam = async (req, res) => {
  const orgId = req.user.orgId;
  const id = req.params.id;
  const team = await Team.findOne({ where: { id, organisation_id: orgId }});
  if (!team) return res.status(404).json({ message: 'Not found' });
  await team.update(req.body);
  await Log.create({ organisation_id: orgId, user_id: req.user.userId, action: 'team_updated', meta: { teamId: team.id }});
  res.json(team);
};

exports.deleteTeam = async (req, res) => {
  const orgId = req.user.orgId;
  const id = req.params.id;
  const team = await Team.findOne({ where: { id, organisation_id: orgId }});
  if (!team) return res.status(404).json({ message: 'Not found' });
  await team.destroy();
  await Log.create({ organisation_id: orgId, user_id: req.user.userId, action: 'team_deleted', meta: { teamId: id }});
  res.json({ ok: true });
};

exports.assignEmployeeToTeam = async (req, res) => {
  const orgId = req.user.orgId;
  const teamId = req.params.teamId;
  const { employeeId } = req.body;

  // validate
  const team = await Team.findOne({ where: { id: teamId, organisation_id: orgId }});
  if (!team) return res.status(404).json({ message: 'Team not found' });

  const emp = await Employee.findOne({ where: { id: employeeId, organisation_id: orgId }});
  if (!emp) return res.status(404).json({ message: 'Employee not found' });

  // create (ignore duplicates)
  await EmployeeTeam.findOrCreate({ where: { employee_id: employeeId, team_id: teamId }});
  await Log.create({ organisation_id: orgId, user_id: req.user.userId, action: 'assigned_employee_to_team', meta: { employeeId, teamId }});
  res.json({ ok: true });
};

exports.unassignEmployeeFromTeam = async (req, res) => {
  const orgId = req.user.orgId;
  const teamId = req.params.teamId;
  const { employeeId } = req.body;
  await EmployeeTeam.destroy({ where: { employee_id: employeeId, team_id: teamId }});
  await Log.create({ organisation_id: orgId, user_id: req.user.userId, action: 'unassigned_employee_from_team', meta: { employeeId, teamId }});
  res.json({ ok: true });
};

exports.assignBatch = async (req, res) => {
  const orgId = req.user.orgId;
  const teamId = req.params.teamId;
  const { employeeIds } = req.body;
  if (!Array.isArray(employeeIds)) return res.status(400).json({ message: 'employeeIds required' });

  // remove existing relations for this team
  await EmployeeTeam.destroy({ where: { team_id: teamId }});

  const values = employeeIds.map(eid => ({ employee_id: eid, team_id: teamId }));
  await EmployeeTeam.bulkCreate(values, { ignoreDuplicates: true });

  await Log.create({ organisation_id: orgId, user_id: req.user.userId, action: 'batch_assigned', meta: { employeeIds, teamId }});
  res.json({ ok: true });
};
