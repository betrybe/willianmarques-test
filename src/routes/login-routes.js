const { Router } = require('express');
const loginControllerFactory = require('../factories/controller/login-controller-factory');

const loginRouter = Router();

loginRouter.post('/login', async (req, res) => {
    const loginController = loginControllerFactory();
    const response = await loginController.login(req);
    res.status(response.statusCode).json(response.body);
});

module.exports = loginRouter;