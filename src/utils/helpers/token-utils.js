const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth-config');

function generateToken(user) {    
    return jwt.sign({ user }, authConfig.secret, authConfig.JWTConfig);
}

function getToken(authorization) {
    return authorization;
}

function decodeToken(token) {
    return jwt.decode(token);
}

module.exports = { generateToken, getToken, decodeToken };