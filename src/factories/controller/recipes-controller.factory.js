const RecipeController = require('../../controller/recipe-controller');
const mongoHelper = require('../../infra/mongo-helper');
const Recipe = require('../../model/recipe');
const RecipeService = require('../../service/recipe-service');

module.exports = () => {
    const recipeModel = new Recipe(mongoHelper);
    const recipeService = new RecipeService(recipeModel);
    const recipeController = new RecipeController(recipeService);
    return recipeController;
};