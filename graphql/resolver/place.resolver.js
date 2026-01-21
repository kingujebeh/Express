export const placeResolver = {
  Query: {
    places: async (_, __, { db }) => {
      return await db.main.collection("places").find({}).toArray();
    },
  },
};
