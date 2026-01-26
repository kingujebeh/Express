// db/index.js
import { DB } from "../class/index.js";
import { accounts, institutions, products, stores } from "./models/index.js";

const { MONGODB_USERNAME, MONGODB_PASSWORD, MONGODB_HOST } = process.env;

if (!MONGODB_USERNAME || !MONGODB_PASSWORD || !MONGODB_HOST) {
  throw new Error("MongoDB credentials missing in environment variables");
}

let accountsDB;
let institutionsDB;
let productsDB;
let storesDB;

export async function connectDatabases() {
  const createDB = async (dbName, models) => {
    const uri = `mongodb+srv://${encodeURIComponent(
      MONGODB_USERNAME
    )}:${encodeURIComponent(MONGODB_PASSWORD)}@${MONGODB_HOST}`;

    const entity = new DB({ name: dbName });
    await entity.connect(uri);

    for (const model of Object.values(models)) {
      entity.useModel(model); // ✅ compiled model cloning
    }

    return entity;
  };

  // Initialize databases
  accountsDB = await createDB("accounts", accounts);
  institutionsDB = await createDB("institutions", institutions);
  productsDB = await createDB("products", products);
  storesDB = await createDB("stores", stores);

  /**
   * Create an Entity (database) and attach models
   */

  console.info("✔ Databases initialized");
  console.info("Accounts models:", Object.keys(accountsDB.models));
  console.info("Institutions models:", Object.keys(institutionsDB.models));
  console.info("Products models:", Object.keys(productsDB.models));
  console.info("Stores models:", Object.keys(storesDB.models));
}

// Export directly as named exports
export {
  accountsDB as accounts,
  productsDB as products,
  institutionsDB as institutions,
  storesDB as stores,
};
