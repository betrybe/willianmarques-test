const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth-config');

module.exports = function ensureAuthenticated(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'missing auth token' });
  }

  try {
    jwt.verify(token, authConfig.secret);
    return next();
  } catch (error) {
    res.status(401).json({ message: 'jwt malformed' });
  }
};
