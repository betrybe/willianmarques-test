const { Router } = require('express');
const userControllerFactory = require('../factories/controller/user-controller-factory');

const userRouter = Router();

userRouter.post('/users', async (req, res) => {
    const userController = userControllerFactory();
    const response = await userController.create(req);
    console.log(response);
    res.status(response.statusCode).json(response.body);
});

userRouter.post('/login', async (req, res) => {
    res.status(200).json();
});

userRouter.get('/user', (req, res) => {
    res.send('teste');
});

module.exports = userRouter;