import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "../schema.js";
import { resolvers } from "../resolvers.js";
import { context } from "../context/index.js";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀 Apollo Server ready at ${url}`);
