export const institutionResolver = {
  Query: {
    institutions: async (_, __, { db }) => {
      return await db.institutions
        .collection("institutions")
        .find({})
        .toArray();
    },
  },
  Institution: {
    place: async (parent, _, { db }) => {
      if (!parent.placeId) return null;
      return await db.main
        .collection("places")
        .findOne({ _id: parent.placeId });
    },
  },
};
