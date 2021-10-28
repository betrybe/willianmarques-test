const { Router } = require('express');
const ensureAuthenticated = require('../utils/middlewares/ensureAuthenticated');

const recipesRouter = Router();

recipesRouter.post('/recipes', ensureAuthenticated, async (req, res) => {
    res.status(200).json();
});

module.exports = recipesRouter;