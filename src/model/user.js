module.exports = class User {
    constructor(dataBaseHelper) {
        this.dataBaseHelper = dataBaseHelper;
    }

    async create({ name, email, password, role = 'user' }) {
        const userCollection = await this.dataBaseHelper.getCollection('users');
        const result = await userCollection.insertOne({ name, email, password, role });
        return result.ops[0];
    }

    async findByEmail({ email }) {
        const userCollection = await this.dataBaseHelper.getCollection('users');
        const user = await userCollection.findOne({ email });
        return user;
    }

    async findByEmailAndPassword({ email, password }) {
        const userCollection = await this.dataBaseHelper.getCollection('users');
        const user = await userCollection.findOne({ email, password });
        return user;
    }
};