// @flow

// Server with DataLoader
// Run: ./node_modules/.bin/babel-node ./articles/graphql/dataloader/dl-server.js

import { ApolloServer } from 'apollo-server';
import schema from './dl-schema';

const server = new ApolloServer({
  schema,
  context: ({ req }) => ({
    req,
    dataloaders: new WeakMap(), // <--- 👍👍👍 ADD JUST ONE THIS LINE; rest logic in type resolvers
  }),
  playground: true,
});

server
  .listen({
    port: 5000,
    endpoint: '/',
    playground: '/playground',
  })
  .then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
