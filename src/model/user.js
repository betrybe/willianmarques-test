import mongoHelper from '../infra/mongo-helper';

module.exports = class User {
    async create(name, email, password, role = 'user') {
        this.userCollection = await mongoHelper.getCollection('users');
        const result = await this.userCollection.insertOne({ name, email, password, role });
        return result.ops[0];
    }
};