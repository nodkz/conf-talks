/* @flow strict */

import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLNonNull,
  graphql,
} from 'graphql';

describe('check how works GraphQLInputObjectType', () => {
  const ArticleInput = new GraphQLInputObjectType({
    name: 'ArticleInput',
    description: 'Article data for input',
    fields: () => ({
      title: {
        type: new GraphQLNonNull(GraphQLString),
        defaultValue: 'Draft',
        description: 'Article description, by default will be "Draft"',
      },
      text: {
        type: new GraphQLNonNull(GraphQLString),
      },
    }),
  });

  const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'Query',
      fields: {
        snippet: {
          args: {
            article: { type: new GraphQLNonNull(ArticleInput) },
          },
          type: GraphQLString,
          resolve: (_, args) => {
            const { title, text } = args.article;
            return `${title} - ${text}`;
          },
        },
      },
    }),
  });

  it('demo query with default value', async () => {
    const res = await graphql({
      schema,
      source: `
        query {
          c1: snippet(article: { title: "Title", text: "Text" })
          c2: snippet(article: { text: "" })
        }
      `,
    });
    expect(res.data).toEqual({
      c1: 'Title - Text',
      c2: 'Draft - ',
    });
  });

  it('missing field in article argument', async () => {
    const res: any = await graphql({
      schema,
      source: `
        query {
          snippet(article: { title: "Title" })
        }
      `,
    });
    expect(res.errors[0].message).toEqual(
      'Field ArticleInput.text of required type String! was not provided.'
    );
  });
});
