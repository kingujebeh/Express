import { ObjectId } from "mongodb";

export const PlaceService = {
  findById: (db, id) =>
    db.collection("places").findOne({ _id: new ObjectId(id) }),
};
