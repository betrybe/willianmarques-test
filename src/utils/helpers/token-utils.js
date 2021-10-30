const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth-config');

function generateToken(user) {    
    return jwt.sign({ user }, authConfig.secret, authConfig.JWTConfig);
}

function decodeToken(token) {
    return jwt.decode(token);
}

module.exports = { generateToken, decodeToken };