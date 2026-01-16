import { existence, products, institutions, web } from "../db/index.js";

const appData = async (req, res, next) => {
  try {
    const databases = [
      { name: "existence", conn: existence },
      { name: "products", conn: products },
      { name: "institutions", conn: institutions },
      { name: "web", conn: web },
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
          products: docs,
        };
      }
    }

    const result = [];

    /* -----------------------------
     * Existence models (flattened)
     * ----------------------------- */
    if (rawData.existence) {
      for (const [modelName, modelData] of Object.entries(rawData.existence)) {
        result.push({
          name: modelName,
          total: modelData.count,
          preview: modelData.products,
        });
      }
    }

    /* -----------------------------
     * products aggregate entity
     * ----------------------------- */
    if (rawData.products) {
      const productsData = [];
      let total = 0;

      for (const [modelName, modelData] of Object.entries(rawData.products)) {
        total += modelData.count;

        productsData.push({
          name: modelName,
          total: modelData.count,
          preview: modelData.products,
        });
      }

      result.push({
        name: "products",
        total,
        data: productsData, // sub-entities per Item model
      });
    }

    /* -----------------------------
     * Institutions aggregate entity
     * ----------------------------- */
    if (rawData.institutions) {
      const institutionsData = [];
      let total = 0;

      for (const [modelName, modelData] of Object.entries(
        rawData.institutions
      )) {
        total += modelData.count;

        institutionsData.push({
          name: modelName,
          total: modelData.count,
          preview: modelData.products,
        });
      }

      result.push({
        name: "institutions",
        total,
        data: institutionsData, // sub-entities per Institution model
      });
    }

    /* -----------------------------
     * Web aggregate entity
     * ----------------------------- */
    if (rawData.web) {
      const webData = [];
      let total = 0;

      for (const [modelName, modelData] of Object.entries(rawData.web)) {
        total += modelData.count;

        webData.push({
          name: modelName,
          total: modelData.count,
          preview: modelData.products,
        });
      }

      result.push({
        name: "web",
        total,
        data: webData, // sub-entities per Web model
      });
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
};

export { appData };
