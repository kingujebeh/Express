// utils/structureModels.js
export const structureModels = (rawData) => {
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

    for (const [modelName, modelData] of Object.entries(rawData.institutions)) {
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

  return result;
};
