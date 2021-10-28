const UnauthorizedError = require('../utils/errors/unauthorized-error');
const messages = require('../utils/helpers/consts-messages');
const { generateToken } = require('../utils/helpers/token-utils');

module.exports = class LoginService {
    constructor(userModel) {
        this.userModel = userModel;
    }

    async login(email, password) {
        const user = await this.userModel.findByEmailAndPassword(email, password);
        if (!user) {
            throw new UnauthorizedError(messages.PASS_EMAIL_INCORRECT);
        }
        return generateToken(user);
    }
};