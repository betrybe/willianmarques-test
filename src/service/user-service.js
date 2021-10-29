const ForbiddenError = require('../utils/errors/forbidden-error');
const UserAlreadyExistsError = require('../utils/errors/user-already-exists-error');
const messages = require('../utils/helpers/consts-messages');
const { decodeToken } = require('../utils/helpers/token-utils');

module.exports = class UserService {
    constructor(userModel) {
        this.userModel = userModel;
    }

    async create(name, email, password) {
        const userExists = await this.userModel.findByEmail(email);
        if (userExists) {
            throw new UserAlreadyExistsError();
        }
        const user = await this.userModel.create(name, email, password);
        delete user.password;
        return user;
    }

    async createAdmin(name, email, password, token) {
        const userExists = await this.userModel.findByEmail(email);
        if (userExists) {
            throw new UserAlreadyExistsError();
        }
        const tokenDecoded = decodeToken(token);
        const { role } = tokenDecoded.user;
        if (role !== 'admin') {
            throw new ForbiddenError(messages.ONLY_ADMIN_CAN);
        }
        const user = await this.userModel.create(name, email, password, 'admin');
        delete user.password;
        return user;
    }
};