import { accountResolver } from "./account.resolver.js";
import { productResolver } from "./product.resolver.js";
import { placeResolver } from "./place.resolver.js";
import { institutionResolver } from "./institution.resolver.js";

export const resolvers = {
  Query: {
    ...accountResolver.Query,
    ...productResolver.Query,
    ...placeResolver.Query,
    ...institutionResolver.Query,
  },

  Mutation: {
    ...accountResolver.Mutation,
    ...productResolver.Mutation,
  },
};
