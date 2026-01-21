import { v7 as uuidv7 } from "uuid";

export const productResolver = {
  Query: {
    products: async (_, __, { db }) => {
      // db.products.collection("products")
      return await db.products.collection("products").find({}).toArray();
    },
    product: async (_, { id }, { db }) => {
      return await db.products.collection("products").findOne({ _id: id });
    },
  },
  Mutation: {
    createProduct: async (_, { input }, { db }) => {
      const id = uuidv7().replace(/-/g, "");

      const newProduct = {
        _id: id,
        id, // convenient to have both or use _id as id map
        ...input,
        createdAt: new Date().toISOString(),
      };

      await db.products.collection("products").insertOne(newProduct);
      return newProduct;
    },
  },
  Product: {
    institution: async (parent, _, { db }) => {
      if (!parent.institutionId) return null;
      return await db.institutions
        .collection("institutions")
        .findOne({ _id: parent.institutionId });
    },
    place: async (parent, _, { db }) => {
      if (!parent.placeId) return null;
      return await db.main
        .collection("places")
        .findOne({ _id: parent.placeId });
    },
  },
};
