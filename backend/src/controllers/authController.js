const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Organisation, User, Log } = require('../models');

exports.register = async (req, res) => {
  const { orgName, adminName, email, password } = req.body;
  if (!orgName || !email || !password) return res.status(400).json({ message: 'orgName, email and password required' });

  try {
    const org = await Organisation.create({ name: orgName });
    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      organisation_id: org.id,
      name: adminName || 'Admin',
      email,
      password_hash,
      is_admin: true
    });

    const token = jwt.sign({ userId: user.id, orgId: org.id }, process.env.JWT_SECRET, { expiresIn: '8h' });

    await Log.create({ organisation_id: org.id, user_id: user.id, action: 'organisation_created', meta: { orgName } });

    return res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'email and password required' });

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id, orgId: user.organisation_id }, process.env.JWT_SECRET, { expiresIn: '8h' });

    await Log.create({ organisation_id: user.organisation_id, user_id: user.id, action: 'login', meta: {} });

    return res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login failed' });
  }
};
