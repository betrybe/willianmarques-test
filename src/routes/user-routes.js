const { Router } = require('express');
const userControllerFactory = require('../factories/controller/user-controller-factory');

const userRouter = Router();

userRouter.post('/users', async (req, res) => {
    const userController = userControllerFactory();
    const response = await userController.create(req);
    res.status(response.statusCode).json(response.body);
});

module.exports = userRouter;