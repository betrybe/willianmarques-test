const { Router } = require('express');
const recipesControllerFactory = require('../factories/controller/recipes-controller.factory');
const ensureAuthenticated = require('../utils/middlewares/ensureAuthenticated');

const recipesRouter = Router();

recipesRouter.post('/recipes', ensureAuthenticated, async (req, res) => {
    const recipesController = recipesControllerFactory();
    const response = await recipesController.create(req);
    res.status(response.statusCode).json(response.body);
});

recipesRouter.get('/recipes', async (req, res) => {
    const recipesController = recipesControllerFactory();
    const response = await recipesController.getAll();
    res.status(response.statusCode).json(response.body);
});

recipesRouter.get('/recipes/:id', async (req, res) => {
    const recipesController = recipesControllerFactory();
    const response = await recipesController.getById(req);
    res.status(response.statusCode).json(response.body);
});

module.exports = recipesRouter;