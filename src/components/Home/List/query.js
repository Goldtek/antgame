import gql from 'graphql-tag';

//GET ALL ANTS
export const GET_ALL_ANTS = gql`
  query ants {
    ants {
      name
      color
      weight
      length
    }
  }
`;
