const UserAlreadyExistsError = require('../utils/errors/user-already-exists-error');

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
        return user;
    }
};