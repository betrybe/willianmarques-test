module.exports = class RecipeService {
    constructor(recipeModel) {
        this.recipeModel = recipeModel;
    }

    async create(name, ingredients, preparation, token) {
        this.teste = '';
        return {
            name,
            ingredients,
            preparation,
            token,
        };
    }
};