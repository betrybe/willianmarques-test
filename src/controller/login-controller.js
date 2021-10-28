const UnauthorizedError = require('../utils/errors/unauthorized-error');
const messages = require('../utils/helpers/consts-messages');
const EmailValidator = require('../utils/helpers/email-validator');
const HttpResponse = require('../utils/helpers/http-response');

module.exports = class LoginController {
    constructor(userService) {
        this.userService = userService;
    }

    async login(req) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                throw new UnauthorizedError(messages.INVALID_FIELDS);
            }
            if (!EmailValidator.isValid(email)) {
                throw new UnauthorizedError(messages.PASS_EMAIL_INCORRECT);
            }
            const token = await this.userService.login(email, password);
            return HttpResponse.ok({ token });
        } catch (error) {
            return HttpResponse.errorRequest(error);
        }
    }
};