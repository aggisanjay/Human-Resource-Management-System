const { Employee, Log } = require('../models');

exports.listEmployees = async (req, res) => {
  const orgId = req.user.orgId;
  const employees = await Employee.findAll({ where: { organisation_id: orgId }});
  res.json(employees);
};

exports.getEmployee = async (req, res) => {
  const orgId = req.user.orgId;
  const id = req.params.id;
  const emp = await Employee.findOne({ where: { id, organisation_id: orgId }});
  if (!emp) return res.status(404).json({ message: 'Not found' });
  res.json(emp);
};

exports.createEmployee = async (req, res) => {
  const orgId = req.user.orgId;
  const payload = req.body;
  const emp = await Employee.create({ ...payload, organisation_id: orgId });
  await Log.create({ organisation_id: orgId, user_id: req.user.userId, action: 'employee_created', meta: { employeeId: emp.id, first_name: emp.first_name }});
  res.status(201).json(emp);
};

exports.updateEmployee = async (req, res) => {
  const orgId = req.user.orgId;
  const id = req.params.id;
  const emp = await Employee.findOne({ where: { id, organisation_id: orgId }});
  if (!emp) return res.status(404).json({ message: 'Not found' });
  await emp.update(req.body);
  await Log.create({ organisation_id: orgId, user_id: req.user.userId, action: 'employee_updated', meta: { employeeId: emp.id }});
  res.json(emp);
};

exports.deleteEmployee = async (req, res) => {
  const orgId = req.user.orgId;
  const id = req.params.id;
  const emp = await Employee.findOne({ where: { id, organisation_id: orgId }});
  if (!emp) return res.status(404).json({ message: 'Not found' });
  await emp.destroy();
  await Log.create({ organisation_id: orgId, user_id: req.user.userId, action: 'employee_deleted', meta: { employeeId: id }});
  res.json({ ok: true });
};
