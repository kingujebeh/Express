import { ProductService } from "../services/product.service.js";
import { InstitutionService } from "../services/institution.service.js";
import { PlaceService } from "../services/place.service.js";

export const productResolvers = {
  Query: {
    products: (_, __, { db }) => ProductService.findAll(db),
    product: (_, { id }, { db }) => ProductService.findById(db, id),
  },

  Mutation: {
    createProduct: (_, { input }, { db, userId }) => {
      if (!userId) throw new Error("Not authenticated");
      return ProductService.create(db, input, userId);
    },
  },

  Product: {
    id: (p) => p._id,

    institution: (p, _, { db }) =>
      p.institutionId ? InstitutionService.findById(db, p.institutionId) : null,

    place: (p, _, { db }) =>
      p.placeId ? PlaceService.findById(db, p.placeId) : null,
  },
};
