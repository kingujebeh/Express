import { accountResolver } from "./account.resolver.js";

export const resolvers = {
  Query: {
    ...accountResolver.Query,
  },

  Mutation: {
    ...accountResolver.Mutation,
  },
};
