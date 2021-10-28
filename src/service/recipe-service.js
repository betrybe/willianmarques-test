const { decodeToken } = require('../utils/helpers/token-utils');

module.exports = class RecipeService {
    constructor(recipeModel) {
        this.recipeModel = recipeModel;
    }

    async create({ name, ingredients, preparation, token }) {
        const tokenDecoded = decodeToken(token);
        // eslint-disable-next-line no-underscore-dangle
        const userId = tokenDecoded.user._id;
        return this.recipeModel.create(name, ingredients, preparation, userId);
    }
};