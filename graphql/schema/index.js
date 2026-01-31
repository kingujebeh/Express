import { readFileSync } from "fs";
import { join } from "path";

const load = (file) =>
  readFileSync(join(process.cwd(), "graphql/schema", file), "utf8");

export const typeDefs = `
${load("query.gql")}
${load("client.gql")}
${load("user.gql")}
${load("product.gql")}
${load("place.gql")}
${load("institution.gql")}
${load("mutation.gql")}
`;
