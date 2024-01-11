const { MongoClient } = require('mongodb');
require("dotenv").config({ path: __dirname + "/../.env" });

const url = process.env.MONGO_URL;
const dbName = process.env.MONGO_DATABASE_NAME;

const client = new MongoClient(url);
async function connectToMongoDB() {
  try {
    await client.connect();
    console.log('Connected successfully to MongoDB');
    const db = client.db(dbName);
    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

module.exports = {
    connectToMongoDB
  };
// function closeMongoDBConnection() {
//   client.close();
//   console.log('MongoDB connection closed');
// }