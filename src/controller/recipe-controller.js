const InvalidParamsError = require('../utils/errors/invalid-params-error');
const HttpResponse = require('../utils/helpers/http-response');

module.exports = class RecipeController {
    constructor(recipeService) {
        this.recipeService = recipeService;
    }

    async create(req) {
        try {
            const { name, ingredients, preparation } = req.body;
            if (!name || !ingredients || !preparation) {
                throw new InvalidParamsError();
            }
            this.recipeService = '';
            return HttpResponse.created({ name, ingredients, preparation });
        } catch (error) {
            return HttpResponse.errorRequest(error);
        }
    }
};