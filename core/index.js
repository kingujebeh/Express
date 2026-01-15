// core/init.js
import mongoose from "mongoose";
import { DB } from "../class/index.js";
import { existence, items } from "../db/index.js";

const init = async () => {
  console.info("Initializing Express");

  const {
    MONGODB_USERNAME,
    MONGODB_PASSWORD,
    MONGODB_URI,
  } = process.env;

  if (!MONGODB_USERNAME || !MONGODB_PASSWORD || !MONGODB_URI) {
    throw new Error("MongoDB credentials missing in environment variables");
  }

  // Central registry
  const dbs = Object.create(null);

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
        new mongoose.Schema({}, {
          strict: false,
          timestamps: true,
        })
      );
    }

    return entity;
  };

  // Initialize databases
  dbs.existence = await createDB("existence", existence);
  dbs.items = await createDB("items", items);

  console.info("✔ Databases initialized");
  console.info("Existence models:", Object.keys(dbs.existence.models));
  console.info("Items models:", Object.keys(dbs.items.models));

  return dbs;
};

export { init };
