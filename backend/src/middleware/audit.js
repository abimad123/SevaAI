const AuditLog = require('../models/AuditLog');

const audit = (action, resource) => async (req, res, next) => {
  const originalJson = res.json.bind(res);
  res.json = async (body) => {
    try {
      await AuditLog.create({
        userId: req.user?._id,
        action,
        resource,
        resourceId: req.params?.id,
        details: { method: req.method, path: req.path, body: req.body },
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.headers['user-agent'],
        status: body?.success === false ? 'failure' : 'success',
      });
    } catch (e) { /* non-blocking */ }
    return originalJson(body);
  };
  next();
};

module.exports = audit;
