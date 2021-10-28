const HttpResponse = require('../utils/helpers/http-response');

module.exports = class RecipeController {
    constructor(recipeService) {
        this.recipeService = recipeService;
    }

    async create(req) {
        try {
            const { name, email, password } = req.body;
            this.recipeService = '';
            return HttpResponse.created({ name, email, password });
        } catch (error) {
            return HttpResponse.errorRequest(error);
        }
    }
};