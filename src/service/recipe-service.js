const { ObjectId } = require('mongodb');
const NotFoundError = require('../utils/errors/not-found-error');
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

    async getById(id) {
        if (!ObjectId.isValid(id)) {
            throw new NotFoundError('recipe not found');
        }
        const recipe = await this.recipeModel.getByid(id);
        if (!recipe) {
            throw new NotFoundError('recipe not found');
        }
        return recipe;
    }
};