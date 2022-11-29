import pkg from '@apollo/client/core/core.cjs';
const { ApolloClient, InMemoryCache, HttpLink } = pkg;
import fetch from 'cross-fetch';
import dotenv from 'dotenv';

dotenv.config();

function getHttpLink(httpURL) {
  return new HttpLink({
    uri: httpURL,
    fetch,
    headers: {
      'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET,
    },
  });
}

export default function makeApolloClient(httpURL) {
  const httpLink = getHttpLink(httpURL);
  const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
  });

  return client;
}
