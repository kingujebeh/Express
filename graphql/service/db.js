// /graphql/service/db.js
import { MongoClient } from "mongodb";

const MONGO_URI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}/`;

const client = new MongoClient(MONGO_URI);

let databases = {};

export async function connectDatabases() {
  await client.connect();

  databases = {
    main: client.db("main"),
    products: client.db("products"),
    institutions: client.db("institutions"),
    web: client.db("web"),
  };

  console.log("✅ Connected to all MongoDB databases");

  return databases;
}

export function getDatabases() {
  if (!databases.main) throw new Error("Databases not connected yet");
  return databases;
}
