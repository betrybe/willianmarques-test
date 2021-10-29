const { decodeToken } = require('./token-utils');

module.exports = function validateUserToRecipe(token, recipeUserId) {
    const tokenDecoded = decodeToken(token);
    const userId = Object.keys(tokenDecoded.user)[0];
    const { role } = tokenDecoded.user;
    return (userId === recipeUserId || role === 'admin');
};