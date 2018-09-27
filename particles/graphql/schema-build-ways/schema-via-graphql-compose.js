// @flow

import { TypeComposer, schemaComposer } from 'graphql-compose';
import { authors, articles } from './data';

const AuthorType = TypeComposer.create(`
  "Author data"
  type Author {
    id: Int
    name: String
  }
`);

const ArticleType = TypeComposer.create({
  name: 'Article',
  description: 'Article data with related Author data',
  fields: {
    title: 'String!',
    text: 'String',
    authorId: 'Int!',
    author: {
      type: () => AuthorType,
      resolve: source => {
        const { authorId } = source;
        return authors.find(o => o.id === authorId);
      },
    },
  },
});

schemaComposer.Query.addFields({
  articles: {
    args: {
      limit: { type: 'Int', defaultValue: 3 },
    },
    type: [ArticleType],
    resolve: (_, args) => {
      const { limit } = args;
      return articles.slice(0, limit);
    },
  },
  authors: {
    type: [AuthorType],
    resolve: () => authors,
  },
});

const schema = schemaComposer.buildSchema();

export default schema;
