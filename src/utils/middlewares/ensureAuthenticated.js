const authConfig = require("../../config/auth-config");

module.exports = function ensureAuthenticated(req, res, next,){
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new Error('JWT token is missing.');
  }

  const [, token] = authHeader.split(' ');

  try {
    jwt.verify(token, authConfig.secret);

    return next();
  } catch {
    throw new TokenExpiredError('Invalid JWT token');
  }
}