const jwt = require('jsonwebtoken');

const secret = 'tryvevqv';
const JWTConfig = {
    expiresIn: '7d',
    algorithm: 'HS256',
};

module.exports = function generateToken(login) {
    return jwt.sign({ login }, secret, JWTConfig);
};