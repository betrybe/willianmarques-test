const { Router } = require('express');

const recipesRouter = Router();

recipesRouter.post('/recipes', async (req, res) => {
    res.status(200).json();
});

module.exports = recipesRouter;