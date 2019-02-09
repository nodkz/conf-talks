import { ApolloServer } from 'apollo-server';
import schema from './schema-via-type-graphql';
// import schema from './schema-via-nexus';

const server = new ApolloServer({ schema });

server.listen(5000).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
