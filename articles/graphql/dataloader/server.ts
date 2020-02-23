// Simple server
// Run: ./node_modules/.bin/babel-node ./articles/graphql/dataloader/server.js

import { ApolloServer } from 'apollo-server';
import dedent from 'dedent';
import schema from './schema';

const server = new ApolloServer({
  schema,
  context: ({ req }) => ({ req }),
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

    console.log(dedent`
    Try to run the following query:

    {
      articles {
        title
        author {
          name
        }
      }
    }
    `);
  });
