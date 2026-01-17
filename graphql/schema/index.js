import { productResolvers } from "../resolvers/product.resolver.js";
import { institutionResolvers } from "../resolvers/institution.resolver.js";

export const resolvers = {
  Query: {
    ...productResolvers.Query,
    ...institutionResolvers.Query,
  },
  Mutation: {
    ...productResolvers.Mutation,
  },
  Product: productResolvers.Product,
  Institution: institutionResolvers.Institution,
};
