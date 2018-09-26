// @flow

import { ApolloServer } from 'apollo-server';
// import schema from './schema-via-graphql';
// import schema from './schema-via-graphql-tools';
import schema from './schema-via-graphql-compose';

const server = new ApolloServer({ schema });

server.listen(5000).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
