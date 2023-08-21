import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

let dbConnection;

let uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster1.7ebrdzp.mongodb.net/?retryWrites=true&w=majority`;

const connectToDb = (cb) => {
  MongoClient.connect(uri)
    .then((client) => {
      dbConnection = client.db();
      return cb();
    })
    .catch((err) => {
      console.log(err);
      return cb(err);
    });
};

const getDatabase = () => dbConnection;

export { connectToDb, getDatabase };
