import { readFileSync } from "fs";
import { join } from "path";

const load = (file) =>
  readFileSync(join(process.cwd(), "graphql/schema", file), "utf8");

export const typeDefs = `
${load("user.gql")}
${load("client.gql")}
${load("product.gql")}
${load("place.gql")}
${load("institution.gql")}
${load("query.gql")}
${load("mutation.gql")}
`;
