import mongoose from "mongoose";
import { DB } from "../class/index.js";
import { existence, products, institutions, web } from "./schemas/index.js";
import { capitalize } from "../functions/index.js";

const { MONGODB_USERNAME, MONGODB_PASSWORD, MONGODB_URI } = process.env;

if (!MONGODB_USERNAME || !MONGODB_PASSWORD || !MONGODB_URI) {
  throw new Error("MongoDB credentials missing in environment variables");
}

/**
 * Create an Entity (database) and attach models
 */
const createDB = async (dbName, schemas) => {
  const uri = `mongodb+srv://${encodeURIComponent(
    MONGODB_USERNAME
  )}:${encodeURIComponent(MONGODB_PASSWORD)}@${MONGODB_URI}`;

  const entity = new DB({ name: dbName });
  await entity.connect(uri);

  for (const [modelName, schema] of Object.entries(schemas)) {
    entity.addModel(capitalize(modelName), schema); // ✅ real schema
  }

  return entity;
};

// Initialize databases
const existenceDB = await createDB("existence", existence);
const productsDB = await createDB("products", products);
const institutionsDB = await createDB("institutions", institutions);
const webDB = await createDB("web", web);

console.info("✔ Databases initialized");
console.info("Existence models:", Object.keys(existenceDB.models));
console.info("Product models:", Object.keys(productsDB.models));
console.info("Institution models:", Object.keys(institutionsDB.models));
console.info("Web models:", Object.keys(webDB.models));

// Export directly as named exports
export {
  existenceDB as existence,
  productsDB as products,
  institutionsDB as institutions,
  webDB as web,
};
