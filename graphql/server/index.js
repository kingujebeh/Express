import "dotenv/config";

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "../schema/index.js";
import { resolvers } from "../resolver/index.js";
import { context } from "../context/index.js";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀 Apollo Server ready at ${url}`);
