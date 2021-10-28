const { ObjectId } = require('mongodb');

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

    async getAll() {
        const recipesCollection = await this.dataBaseHelper.getCollection('recipes');
        const result = await recipesCollection.find().toArray();
        return result;
    }

    async getByid(id) {
        const recipesCollection = await this.dataBaseHelper.getCollection('recipes');
        const result = await recipesCollection.findOne(ObjectId(id));
        return result;
    }

    async update(id, name, ingredients, preparation) {
        const recipesCollection = await this.dataBaseHelper.getCollection('recipes');
        const query = { _id: ObjectId(id) };
        const newvalues = { $set: { name, ingredients, preparation } };
        const opt = { returnOriginal: false };
        const result = await recipesCollection.findOneAndUpdate(query, newvalues, opt);
        return result.value;
    }
};