const { Router } = require('express');
const userControllerFactory = require('../factories/controller/user-controller-factory');
const ensureAuthenticated = require('../utils/middlewares/ensureAuthenticated');

const userRouter = Router();

userRouter.post('/users', async (req, res) => {
    const userController = userControllerFactory();
    const response = await userController.create(req);
    res.status(response.statusCode).json(response.body);
});

userRouter.post('/users/admin', ensureAuthenticated, async (req, res) => {
    const userController = userControllerFactory();
    const response = await userController.createAdmin(req);
    res.status(response.statusCode).json(response.body);
});

module.exports = userRouter;