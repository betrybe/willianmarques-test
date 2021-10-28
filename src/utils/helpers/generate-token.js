const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth-config');

module.exports = function generateToken(user) {    
    return jwt.sign({ user }, authConfig.secret, authConfig.JWTConfig);
};