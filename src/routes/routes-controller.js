const { Router } = require('express');
const loginRouter = require('./login-routes');
const recipesRouter = require('./recipes-routes');
const userRouter = require('./user-routes');

const routerController = Router();

routerController.use(userRouter);
routerController.use(loginRouter);
routerController.use(recipesRouter);

module.exports = routerController;