import { ObjectId } from "mongodb";

export const InstitutionService = {
  findById: (db, id) =>
    db.collection("institutions").findOne({ _id: new ObjectId(id) }),
};
