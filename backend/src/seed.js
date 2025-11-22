require('dotenv').config();
const { sequelize, Organisation, User, Employee, Team, EmployeeTeam } = require('./models');

async function seed() {
  try {
    await sequelize.sync({ alter: true });

    const org = await Organisation.create({ name: 'DemoCorp' });
    const admin = await User.create({
      organisation_id: org.id,
      name: 'Admin',
      email: 'admin@democorp.com',
      password_hash: await require('bcrypt').hash('Admin@123', 10),
      is_admin: true
    });

    const e1 = await Employee.create({ organisation_id: org.id, first_name: 'Alice', last_name: 'W.' , email: 'alice@democorp.com' });
    const e2 = await Employee.create({ organisation_id: org.id, first_name: 'Bob', last_name: 'K.' , email: 'bob@democorp.com' });

    const t1 = await Team.create({ organisation_id: org.id, name: 'Frontend', description: 'UI team' });
    const t2 = await Team.create({ organisation_id: org.id, name: 'Backend', description: 'API team' });

    await EmployeeTeam.create({ employee_id: e1.id, team_id: t1.id });
    await EmployeeTeam.create({ employee_id: e2.id, team_id: t2.id });

    console.log('Seed complete. Admin:', admin.email, 'password: Admin@123');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed', err);
    process.exit(1);
  }
}
seed();
