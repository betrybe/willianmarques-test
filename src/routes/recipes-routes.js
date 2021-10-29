const { Router } = require('express');
const upload = require('../config/multer-config');
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

recipesRouter.put('/recipes/:id', ensureAuthenticated, async (req, res) => {
    const recipesController = recipesControllerFactory();
    const response = await recipesController.update(req);
    res.status(response.statusCode).json(response.body);
});

recipesRouter.delete('/recipes/:id', ensureAuthenticated, async (req, res) => {
    const recipesController = recipesControllerFactory();
    const response = await recipesController.deleteById(req);
    res.status(response.statusCode).json();
});

recipesRouter.put('/recipes/:id/image', 
upload.single('image'), 
ensureAuthenticated, async (req, res) => {
    const recipesController = recipesControllerFactory();
    const response = await recipesController.updateUrlImage(req);
    res.status(response.statusCode).json();
});

module.exports = recipesRouter;