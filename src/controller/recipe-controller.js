const InvalidParamsError = require('../utils/errors/invalid-params-error');
const HttpResponse = require('../utils/helpers/http-response');
const getImagePath = require('../utils/helpers/get-image-path');

module.exports = class RecipeController {
    constructor(recipeService) {
        this.recipeService = recipeService;
    }

    async create(req) {
        try {
            const { name, ingredients, preparation } = req.body;
            const token = req.headers.authorization;
            if (!name || !ingredients || !preparation) {
                throw new InvalidParamsError();
            }
            const recipeToCreate = { name, ingredients, preparation, token };
            const recipe = await this.recipeService.create(recipeToCreate);
            return HttpResponse.created({ recipe });
        } catch (error) {
            return HttpResponse.errorRequest(error);
        }
    }

    async getAll() {
        try {
            const recipes = await this.recipeService.getAll();
            return HttpResponse.ok(recipes);
        } catch (error) {
            return HttpResponse.errorRequest(error);
        }
    }

    async getById(req) {
        try {
            const { id } = req.params;
            const recipe = await this.recipeService.getById(id);
            return HttpResponse.ok(recipe);
        } catch (error) {
            return HttpResponse.errorRequest(error);
        }
    }

    async update(req) {
        try {
            const { id } = req.params;
            const { name, ingredients, preparation } = req.body;
            const token = req.headers.authorization;
            if (!name || !ingredients || !preparation) {
                throw new InvalidParamsError();
            }
            const recipeToUpdate = { id, name, ingredients, preparation, token };
            const recipe = await this.recipeService.update(recipeToUpdate);
            return HttpResponse.ok(recipe);
        } catch (error) {
            return HttpResponse.errorRequest(error);
        }
    }

    async deleteById(req) {
        try {
            const { id } = req.params;
            const token = req.headers.authorization;
            await this.recipeService.deleteById({ id, token });
            return HttpResponse.noContent();
        } catch (error) {
            return HttpResponse.errorRequest(error);
        }
    }

    async updateUrlImage(req) {
        try {
            const { id } = req.params;
            const token = req.headers.authorization;
            const urlImage = getImagePath(req.file.filename);
            const recipe = await this.recipeService.updateUrlImage({ id, urlImage, token });
            return HttpResponse.ok(recipe);
        } catch (error) {
            return HttpResponse.errorRequest(error);
        }
    }
};