/* @flow strict */

import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLBoolean, graphql } from 'graphql';

describe('mutation rules', () => {
  it('test nested mutations via aliases', async () => {
    const serialResults = [];
    const ArticleMutations = new GraphQLObjectType({
      name: 'ArticleMutations',
      fields: () => ({
        like: {
          type: GraphQLBoolean,
          resolve: async () => {
            await new Promise(resolve => setTimeout(resolve, 100));
            serialResults.push('like executed');
            return true;
          },
        },
        unlike: {
          type: GraphQLBoolean,
          resolve: async () => {
            await new Promise(resolve => setTimeout(resolve, 50));
            serialResults.push('unlike executed');
            return true;
          },
        },
      }),
    });

    const schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Query',
        fields: { hello: { type: GraphQLString, resolve: () => 'world' } },
      }),
      mutation: new GraphQLObjectType({
        name: 'Mutation',
        fields: { article: { type: ArticleMutations, resolve: () => ({}) } },
      }),
    });

    const res = await graphql({
      schema,
      source: `
      mutation {
        op1: article { like }
        op2: article { like }
        op3: article { unlike }
        op4: article { like }
      }
    `,
    });
    expect(serialResults).toEqual([
      'like executed',
      'like executed',
      'unlike executed',
      'like executed',
    ]);
  });
});
