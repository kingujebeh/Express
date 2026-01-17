import gql from "graphql-tag";

export const typeDefs = gql`
  type Product {
    book: String
    drink: String
    hair: String
    perfume: String
    vehicle: String
    watch: String
  }

  type Institution {
    academy: String
    bank: String
    hospital: String
    hotel: String
    school: String
    university: String
  }

  type Competition {
    league: String
    tournament: String
    game: String
  }

  type Events {
    tournament: String
    game: String
    marriages: String
    seminar: String
  }

  type Place {
    cities: String
    countries: String
    states: String
    kingdoms: String
    realms: String
    towns: String
  }

  type Query {
    health: String
    events: Events
    apps: String
    games: String
    courses: String
    competition: Competition
    accomodation: String
    music: String
    posts: String
    teams: String
    users: String
    vendors: String
    videos: String
    institutions: Institution
    products: Product
    workstations: String
    places: Place
  }
`;
