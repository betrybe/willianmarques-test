module.exports = class RecipeService {
    constructor(recipeModel) {
        this.recipeModel = recipeModel;
    }

    async create(name, ingredients, preparation, userId) {
        this.teste = '';
        return {
            name,
            ingredients,
            preparation,
            userId,
        };
    }
};