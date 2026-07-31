const Log = require('../models/Log');

const logAction = async (req, action, entity, entityId = null, details = {}) => {
  try {
    if (req.user) {
      await Log.create({
        action,
        entity,
        entityId,
        user: req.user._id,
        details,
        ip: req.ip || req.connection.remoteAddress
      });
    }
  } catch (err) {
    console.error('Logging failed:', err.message);
  }
};

module.exports = { logAction };
