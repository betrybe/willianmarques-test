const InvalidParamsError = require('../utils/errors/invalid-params-error');
const EmailValidator = require('../utils/helpers/email-validator');
const HttpResponse = require('../utils/helpers/http-response');

module.exports = class UserController {
    constructor(userService) {
        this.userService = userService;
    }

    async create(req) {
        try {
            const { name, email, password } = req.body;
            if (!name || !EmailValidator.isValid(email) || !password) {
                throw new InvalidParamsError();
            }
            const user = await this.userService.create(name, email, password);
            return HttpResponse.created({ user });
        } catch (error) {
            return HttpResponse.errorRequest(error);
        }
    }
};