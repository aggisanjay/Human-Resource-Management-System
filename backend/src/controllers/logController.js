const { Log } = require('../models');
const { Op, Sequelize } = require('sequelize');

exports.listLogs = async (req, res) => {
  const orgId = req.user.orgId;
  const { action, userId, since, until, q, limit = 50, offset = 0 } = req.query;

  const where = { organisation_id: orgId };

  if (action) where.action = action;
  if (userId) where.user_id = Number(userId);
  if (since || until) where.timestamp = {};
  if (since) where.timestamp[Op.gte] = new Date(since);
  if (until) where.timestamp[Op.lte] = new Date(until);

  if (q) {
    where[Op.or] = [
      { action: { [Op.iLike]: `%${q}%` } },
      Sequelize.literal(`meta::text ILIKE '%${q.replace(/'/g, "''")}%'`)
    ];
  }

  const logs = await Log.findAll({
    where,
    order: [['timestamp', 'DESC']],
    limit: Number(limit),
    offset: Number(offset)
  });

  res.json(logs);
};
