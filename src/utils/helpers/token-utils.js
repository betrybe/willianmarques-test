const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth-config');

function generateToken(user) {    
    return jwt.sign({ user }, authConfig.secret, authConfig.JWTConfig);
}

function getToken(authorization) {
    const [, token] = authorization.split(' ');
    return token;
}

function decodeToken(token) {
    return jwt.decode(token);
}

module.exports = { generateToken, getToken, decodeToken };