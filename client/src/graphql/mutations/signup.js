import { gql } from "@apollo/client/core";

export const SIGNUP = gql`
  mutation Signup($username: String!, $email: String!, $password: String!) {
    signup(
      input: {
        username: $username
        email: $email
        password: $password
      }
    ) {
      token
      user {
        id
        username
        username
        email
      }
    }
  }
`;
