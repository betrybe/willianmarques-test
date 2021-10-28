const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth-config');

module.exports = function ensureAuthenticated(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).json({ message: 'Token is missing' });
  }

  try {
    jwt.verify(token, authConfig.secret);

    return next();
  } catch (error) {
    res.status(401).json({ message: 'jwt malformed' });
  }
};
