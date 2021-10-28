const InvalidParamsError = require('../utils/errors/invalid-params-error');
const HttpResponse = require('../utils/helpers/http-response');

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
};