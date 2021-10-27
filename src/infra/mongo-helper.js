const { MongoClient } = require('mongodb');
const mongoConfig = require('../config/mongo');

class MongoHelper {
    async connect() {
        this.client = await MongoClient.connect(mongoConfig.MONGO_DB_URL, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        this.dataBase = this.client.db(mongoConfig.DB_NAME);
    }

    async disconnect() {
        await this.client.close();
    }

    async getCollection(name) {
        if (!this.client) {
          await this.connect();
        }
        return this.dataBase.collection(name);
    }
}

const mongoHelper = new MongoHelper();
module.exports = mongoHelper;
