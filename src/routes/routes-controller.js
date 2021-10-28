const { Router } = require('express');
const loginRouter = require('./login-routes');
const userRouter = require('./user-routes');

const routerController = Router();

routerController.use(userRouter);
routerController.use(loginRouter);

module.exports = routerController;