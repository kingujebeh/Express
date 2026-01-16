import mongoose from "mongoose";
import { DB } from "../class/index.js";
import { existence, items, institutions } from "./models/index.js";

const { MONGODB_USERNAME, MONGODB_PASSWORD, MONGODB_URI } = process.env;

if (!MONGODB_USERNAME || !MONGODB_PASSWORD || !MONGODB_URI) {
  throw new Error("MongoDB credentials missing in environment variables");
}

/**
 * Create an Entity (database) and attach models
 */
const createDB = async (dbName, modelsObj) => {
  const uri = `mongodb+srv://${encodeURIComponent(
    MONGODB_USERNAME
  )}:${encodeURIComponent(MONGODB_PASSWORD)}@${MONGODB_URI}`;

  const entity = new DB({ name: dbName });
  await entity.connect(uri);

  for (const modelName of Object.keys(modelsObj)) {
    entity.addModel(
      modelName,
      new mongoose.Schema({}, { strict: false, timestamps: true })
    );
  }

  return entity;
};

// Initialize databases
const existenceDB = await createDB("existence", existence);
const itemsDB = await createDB("items", items);
const institutionsDB = await createDB("institutions", institutions);

console.info("✔ Databases initialized");
console.info("Existence models:", Object.keys(existenceDB.models));
console.info("Item models:", Object.keys(itemsDB.models));
console.info("Institution models:", Object.keys(institutionsDB.models));

// Export directly as named exports
export {
  existenceDB as existence,
  itemsDB as items,
  institutionsDB as institutions,
};
