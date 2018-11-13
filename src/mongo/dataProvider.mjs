import mongodb from 'mongodb';
const MongoClient = mongodb.MongoClient;

class DataProvider {
    constructor () {        
        const { mongoUser = "user", mongoPass = "user" } = process.env;
        const connection = `mongodb+srv://${mongoUser}:${mongoPass}@2018-fhixh.mongodb.net/test?retryWrites=true`;
        console.log(`Connecting to DB.. ${connection}`);

        (async () => {
            this.client = await MongoClient.connect(connection, { useNewUrlParser: true });
            this.db = this.client.db('dashboard');
            console.log('db open');
        })();
    }
}

const provider = new DataProvider();
export default (name) => {
    return provider.db.collection(name);
};