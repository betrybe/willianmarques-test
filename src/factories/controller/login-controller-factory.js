const User = require('../../model/user');
const mongoHelper = require('../../infra/mongo-helper');
const LoginController = require('../../controller/login-controller');
const LoginService = require('../../service/login-service');

module.exports = () => {
    const userModel = new User(mongoHelper);
    const loginService = new LoginService(userModel);
    const loginController = new LoginController(loginService);
    return loginController;
};