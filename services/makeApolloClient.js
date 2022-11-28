import pkg from '@apollo/client/core/core.cjs';
const { ApolloClient, InMemoryCache, HttpLink } = pkg;
import fetch from 'cross-fetch';

function getHttpLink(httpURL) {
  return new HttpLink({
    uri: httpURL,
    fetch,
    headers: {
      'x-hasura-admin-secret': `nAkV99ENc4yWM9QQSLz1852wSZW0Uw6OdeiS8QGlsF8=`,
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
