// utils/structureModels.js
export const structureModels = (rawData) => {
  const result = [];

  for (const [dbName, models] of Object.entries(rawData)) {
    const dbBlock = {
      database: dbName,
      data: [],
    };

    for (const [modelName, modelData] of Object.entries(models)) {
      dbBlock.data.push({
        name: modelName,
        total: modelData.count,
        preview: modelData.items,
      });
    }

    result.push(dbBlock);
  }

  return result;
};
