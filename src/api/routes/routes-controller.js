const { Router } = require('express');
const { default: userRouter } = require('./user-routes');

const routerController = Router();

routerController.use(userRouter);

export default routerController;