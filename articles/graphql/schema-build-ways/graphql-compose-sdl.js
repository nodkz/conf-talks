// @flow

import { ApolloServer } from 'apollo-server';
import { schemaComposer } from 'graphql-compose';
import { authors, articles } from './data';

const typeDefs = `
  "Author data"
  type Author {
    id: Int
    name: String
  }

  "Article data with related Author data"
  type Article {
    title: String!
    text: String
    "Record id from Author table"
    authorId: Int!
    author: Author
  }

  input A {
    aa: AA
  }

  input AA {
    aaa: Int
  }

  type Query {
    articles(limit: Int = 10, a: A): [Article]
    authors: [Author]
  }
`;

const resolvers = {
  Article: {
    author: (source) => {
      const { authorId } = source;
      return authors.find((o) => o.id === authorId);
    },
  },
  Query: {
    articles: (_, args) => {
      const { limit } = args;
      // return [{ title: JSON.stringify(args) }];
      return articles.slice(0, limit);
    },
    authors: () => authors,
  },
};

schemaComposer.addTypeDefs(typeDefs);
schemaComposer.addResolveMethods(resolvers);
const schema = schemaComposer.buildSchema();

const server = new ApolloServer({ schema });
server.listen(5000).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
