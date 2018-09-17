/* @flow strict */

import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  graphql,
} from 'graphql';

describe('check how works GraphQLObjectType', () => {
  const articles = [
    { title: 'A1', text: 'T1', authorId: 1 },
    { title: 'A2', text: 'T2', authorId: 1 },
    { title: 'A3', text: 'T3', authorId: 2 },
    { title: 'A4', text: 'T4', authorId: 3 },
    { title: 'A5', text: 'T5', authorId: 1 },
  ];
  const authors = [
    { id: 1, name: 'Author 1' },
    { id: 2, name: 'Author 2' },
    { id: 3, name: 'Author 3' },
  ];

  const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: 'Author data with related data',
    fields: () => ({
      id: { type: GraphQLInt },
      name: { type: GraphQLString },
    }),
  });

  const ArticleType = new GraphQLObjectType({
    name: 'Article',
    description: 'Article data with related data',
    fields: () => ({
      title: {
        type: new GraphQLNonNull(GraphQLString),
      },
      text: {
        type: new GraphQLNonNull(GraphQLString),
      },
      authorId: {
        type: new GraphQLNonNull(GraphQLInt),
      },
      author: {
        type: AuthorType,
        resolve: source => {
          const { authorId } = source;
          return authors.find(o => o.id === authorId);
        },
      },
    }),
  });

  const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'Query',
      fields: {
        articles: {
          args: {
            limit: { type: GraphQLInt, defaultValue: 3 },
          },
          type: new GraphQLList(ArticleType),
          resolve: (_, args) => {
            const { limit } = args;
            return articles.slice(0, limit - 1);
          },
        },
      },
    }),
  });

  it('demo query', async () => {
    const res = await graphql({
      schema,
      source: `
        query {
          articles(limit: 3) {
            title
            text
          }
        }
      `,
    });
    expect(res.data).toEqual({
      articles: [{ text: 'T1', title: 'A1' }, { text: 'T2', title: 'A2' }],
    });
  });

  it('demo nested query with author subquery', async () => {
    const res = await graphql({
      schema,
      source: `
        query {
          articles(limit: 3) {
            title
            text
            author {
              name
            }
          }
        }
      `,
    });
    expect(res.data).toEqual({
      articles: [
        { author: { name: 'Author 1' }, text: 'T1', title: 'A1' },
        { author: { name: 'Author 1' }, text: 'T2', title: 'A2' },
      ],
    });
  });
});
