import { accountResolver } from "./account.resolver.js";
import { productResolver } from "./product.resolver.js";
import { placeResolver } from "./place.resolver.js";
import { institutionResolver } from "./institution.resolver.js";

// graphql/utils/wrapAllResolvers.js

export function wrapAllResolvers(resolvers) {
  const wrapped = {};

  for (const typeName in resolvers) {
    wrapped[typeName] = {};

    for (const fieldName in resolvers[typeName]) {
      const resolver = resolvers[typeName][fieldName];

      // wrap only functions (skip scalars or nested objects)
      if (typeof resolver === "function") {
        wrapped[typeName][fieldName] = async (parent, args, context, info) => {
          try {
            return await resolver(parent, args, context, info);
          } catch (err) {
            console.error(
              `🚨 GraphQL Resolver Error in ${typeName}.${fieldName}:`,
              err
            );
            throw err; // rethrow so Apollo still sends proper GraphQL error
          }
        };
      } else {
        wrapped[typeName][fieldName] = resolver;
      }
    }
  }

  return wrapped;
}

export const resolvers = wrapAllResolvers({
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
});
