const { ObjectId } = require('mongodb');
const NotFoundError = require('../utils/errors/not-found-error');
const UnauthorizedError = require('../utils/errors/unauthorized-error');
const { decodeToken } = require('../utils/helpers/token-utils');
const messages = require('../utils/helpers/consts-messages');
const validateUserToRecipe = require('../utils/helpers/validate-user-to-recipe');

module.exports = class RecipeService {
    constructor(recipeModel) {
        this.recipeModel = recipeModel;
    }

    async create({ name, ingredients, preparation, token }) {
        const tokenDecoded = decodeToken(token);
        const userId = Object.keys(tokenDecoded.user)[0];
        const recipe = await this.recipeModel.create(name, ingredients, preparation, userId);
        return recipe;
    }

    async getAll() {
        const recipes = await this.recipeModel.getAll();
        return recipes;
    }

    async getById(id) {
        if (!ObjectId.isValid(id)) {
            throw new NotFoundError(messages.RECIPE_NOTFOUND);
        }
        const recipe = await this.recipeModel.getByid(id);
        if (!recipe) {
            throw new NotFoundError(messages.RECIPE_NOTFOUND);
        }
        return recipe;
    }

    async update({ id, name, ingredients, preparation, token }) {
        if (!ObjectId.isValid(id)) {
            throw new NotFoundError(messages.RECIPE_NOTFOUND);
        }
        const recipeExists = await this.recipeModel.getByid(id);
        if (!recipeExists) {
            throw new NotFoundError(messages.RECIPE_NOTFOUND);
        }
        if (!validateUserToRecipe(token, recipeExists.userId)) {
            throw new UnauthorizedError(messages.RECIPE_NOT_YOURS);
        }
        const recipe = await this.recipeModel.update(id, name, ingredients, preparation);
        return recipe;
    }

    async deleteById({ id, token }) {
        if (!ObjectId.isValid(id)) {
            throw new NotFoundError(messages.RECIPE_NOTFOUND);
        }
        const recipeExists = await this.recipeModel.getByid(id);
        if (!recipeExists) {
            throw new NotFoundError(messages.RECIPE_NOTFOUND);
        }
        if (!validateUserToRecipe(token, recipeExists.userId)) {
            throw new UnauthorizedError(messages.RECIPE_NOT_YOURS);
        }
        await this.recipeModel.deleteById(id);
    }

    async updateUrlImage({ id, urlImage, token }) {
        if (!ObjectId.isValid(id)) {
            throw new NotFoundError(messages.RECIPE_NOTFOUND);
        }
        const recipeExists = await this.recipeModel.getByid(id);
        if (!recipeExists) {
            throw new NotFoundError(messages.RECIPE_NOTFOUND);
        }
        if (!validateUserToRecipe(token, recipeExists.userId)) {
            throw new UnauthorizedError(messages.RECIPE_NOT_YOURS);
        }
        const recipe = await this.recipeModel.updateUrlImage(id, urlImage);
        return recipe;
    }
};