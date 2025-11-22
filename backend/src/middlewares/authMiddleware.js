const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(payload.userId);
    if (!user) return res.status(401).json({ message: 'Invalid token - user not found' });

    // attach user info
    req.user = { userId: user.id, orgId: user.organisation_id };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
