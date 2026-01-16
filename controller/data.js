import { existence, items } from "../db/index.js";
import { structureModels } from "../scripts/index.js";

const appData = async (req, res, next) => {
  try {
    const databases = [
      { name: "existence", conn: existence },
      { name: "items", conn: items },
    ];

    const rawData = {};

    for (const db of databases) {
      rawData[db.name] = {};

      const models = db.conn.models;

      for (const modelName of Object.keys(models)) {
        const Model = models[modelName];

        const [count, docs] = await Promise.all([
          Model.countDocuments(),
          Model.find().limit(100).lean(),
        ]);

        rawData[db.name][modelName] = {
          count,
          items: docs,
        };
      }
    }

    res.json(structureModels(rawData));
  } catch (err) {
    next(err);
  }
};

export { appData };
