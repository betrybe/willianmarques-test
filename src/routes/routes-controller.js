const { Router } = require('express');
const userRouter = require('./user-routes');

const routerController = Router();

routerController.use(userRouter);

module.exports = routerController;