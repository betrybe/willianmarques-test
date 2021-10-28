const { decodeToken } = require('../utils/helpers/token-utils');

module.exports = class RecipeService {
    constructor(recipeModel) {
        this.recipeModel = recipeModel;
    }

    async create({ name, ingredients, preparation, token }) {
        const tokenDecoded = decodeToken(token);
        // eslint-disable-next-line no-underscore-dangle
        const userId = tokenDecoded.user._id;
        const recipe = await this.recipeModel.create(name, ingredients, preparation, userId);
        return recipe;
    }

    async getAll() {
        const recipes = await this.recipeModel.getAll();
        return recipes;
    }
};