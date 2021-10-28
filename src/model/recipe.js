module.exports = class Recipe {
    constructor(dataBaseHelper) {
        this.dataBaseHelper = dataBaseHelper;
    }

    async create(name, ingredients, preparation, userId) {
        const recipesCollection = await this.dataBaseHelper.getCollection('recipes');
        const recipe = { name, ingredients, preparation, userId };
        const result = await recipesCollection.insertOne(recipe);
        return result.ops[0];
    }
};