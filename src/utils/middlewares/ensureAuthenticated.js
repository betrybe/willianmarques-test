const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth-config');
const { getToken } = require('../helpers/token-utils');

module.exports = function ensureAuthenticated(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: 'Token is missing' });
  }

  const token = getToken(authHeader);

  try {
    jwt.verify(token, authConfig.secret);

    return next();
  } catch (error) {
    res.status(401).json({ message: 'jwt malformed' });
  }
};
