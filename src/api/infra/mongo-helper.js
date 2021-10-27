const { MongoClient } = require('mongodb');
const { default: mongo } = require('../config/mongo');

class MongoHelper {
    async connect() {
        this.client = await MongoClient.connect(mongo.MONGO_DB_URL, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        this.dataBase = this.client.db(mongo.DB_NAME);
    }

    async disconnect() {
        await this.client.close();
    }

    async getCollection(name) {
        if (!this.client.isConnected() || !this.client) {
          await this.connect();
        }
        return this.dataBase.collection(name);
    }
}

const mongoHelper = new MongoHelper();
export default mongoHelper;
