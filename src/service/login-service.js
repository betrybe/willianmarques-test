const UnauthorizedError = require('../utils/errors/unauthorized-error');
const messages = require('../utils/helpers/consts-messages');
const generateToken = require('../utils/helpers/generate-token');

module.exports = class LoginService {
    constructor(userModel) {
        this.userModel = userModel;
    }

    async login(email, password) {
        const userExists = await this.userModel.findByEmailAndPassword(email, password);
        if (!userExists) {
            throw new UnauthorizedError(messages.PASS_EMAIL_INCORRECT);
        }
        return generateToken(email);
    }
};