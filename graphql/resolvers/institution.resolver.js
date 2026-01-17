import { InstitutionService } from "../services/institution.service.js";
import { PlaceService } from "../services/place.service.js";

export const institutionResolvers = {
  Query: {
    institutions: (_, __, { db }) =>
      db.collection("institutions").find().toArray(),
  },

  Institution: {
    id: (i) => i._id,
    place: (i, _, { db }) =>
      i.placeId ? PlaceService.findById(db, i.placeId) : null,
  },
};
