import { ObjectId } from "mongodb";

export const ProductService = {
  findAll: (db) => db.collection("products").find().toArray(),

  findById: (db, id) =>
    db.collection("products").findOne({ _id: new ObjectId(id) }),

  create: async (db, input, userId) => {
    const doc = {
      ...input,
      institutionId: input.institutionId
        ? new ObjectId(input.institutionId)
        : null,
      placeId: input.placeId
        ? new ObjectId(input.placeId)
        : null,
      ownerId: userId,
      createdAt: new Date().toISOString(),
    };

    const { insertedId } = await db.collection("products").insertOne(doc);
    return { ...doc, _id: insertedId };
  },
};
