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
        preview: modelData.items,
      });
    }
  }

  /* -----------------------------
   * Items aggregate entity
   * ----------------------------- */
  if (rawData.items) {
    const itemsData = [];
    let total = 0;

    for (const [modelName, modelData] of Object.entries(rawData.items)) {
      total += modelData.count;

      itemsData.push({
        name: modelName,
        total: modelData.count,
        preview: modelData.items,
      });
    }

    result.push({
      name: "items",
      total,
      data: itemsData, // sub-entities per Item model
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
        preview: modelData.items,
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
