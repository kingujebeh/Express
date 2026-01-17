import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017");

let databases = null;

export const connectDBs = async () => {
  if (!databases) {
    await client.connect();

    databases = {
      existence: client.db("existence"),
      products: client.db("products"),
      institutions: client.db("institutions"),
    };

    console.log("✅ MongoDB databases connected");
  }

  return databases;
};
