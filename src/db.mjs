import mongodb from 'mongodb';
import _ from 'lodash';
const MongoClient = mongodb.MongoClient;

class DB {
    async connect() {
        const { mongoUser, mongoPass } = process.env;
        const connection = `mongodb+srv://${mongoUser}:${mongoPass}@cluster0-gwoyf.mongodb.net/test?retryWrites=true`;
        console.log(`Connecting to DB.. ${connection}`);

        this.client = await MongoClient.connect(connection, { useNewUrlParser: true });
        this.db = this.client.db('spa');
        console.log('db open');
    }
}

export default new DB();