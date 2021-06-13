import gql from "graphql-tag";

export const CREATE_USER = gql`
  mutation($username: String!, $passeord: String! $email: String!){
    createUser(input: {
      username: $username,
      password: $password,
      email:$email
    }){
      user {
        id
        username
      }
    }
  }
`;

export const GET_TOKEN = gql`
  mutation($username: String!, $passoword: String!){
    tokenAuth(username: $username, password: $password){
      token
    }
  }
`;