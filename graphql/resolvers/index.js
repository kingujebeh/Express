import { authResolvers } from "../resolvers/auth.resolver.js";
import { productResolvers } from "../resolvers/product.resolver.js";
import { institutionResolvers } from "../resolvers/institution.resolver.js";

export const resolvers = {
  Query: {
    ...productResolvers.Query,
    ...institutionResolvers.Query,
  },

  Mutation: {
    ...authResolvers.Mutation,
  },
};
