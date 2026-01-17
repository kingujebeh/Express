import gql from "graphql-tag";

export const typeDefs = gql`
  type User {
    uid: ID!
    username: String!
    email: String!
    createdAt: String!
  }

  type AuthPayload {
    user: User!
    token: String!
  }

  input SignupInput {
    username: String
    email: String!
    password: String!
  }

  input SigninInput {
    identifier: String! # username OR email
    password: String!
  }

  mutation Signup {
    signup(
      input: {
        username: "augment"
        email: "augment@mail.com"
        password: "secret123"
      }
    ) {
      token
      user {
        id
        username
        email
      }
    }
  }

  mutation Signin {
    signin(input: { identifier: "augment@mail.com", password: "secret123" }) {
      token
      user {
        username
      }
    }
  }

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
    event: Events
    events: Events
    app: String
    apps: String
    game: String
    games: String
    course: String
    courses: String
    competition: Competition
    competitions: Competition
    accomodation: String
    accomodations: String
    music: String
    post: String
    posts: String
    team: String
    teams: String
    user: String
    users: String
    vendor: String
    vendors: String
    video: String
    videos: String
    institution: Institution
    institutions: Institution
    product: Product
    products: Product
    workstation: String
    place: Place
    places: Place
    community: String
    communities: String
    currency: String
    currencies: String
  }
`;
