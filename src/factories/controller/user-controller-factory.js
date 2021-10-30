const UserController = require('../../controller/user-controller');
const UserService = require('../../service/user-service');
const User = require('../../model/user');
const mongoHelper = require('../../infra/mongo-helper');

module.exports = () => {
    const userModel = new User(mongoHelper);
    const userService = new UserService(userModel);
    const userController = new UserController(userService);
    return userController;
};