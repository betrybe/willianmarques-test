const { MongoClient } = require('mongodb');
const { default: mongo } = require('../config/mongo');

export default class MongoHelper {
    async connect() {
        this.client = await MongoClient.connect(mongo.MONGO_DB_URL, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        return this.client.db(mongo.DB_NAME);
    }

    async disconnect() {
        await this.client.close();
    }
}
