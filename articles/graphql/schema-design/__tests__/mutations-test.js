/* @flow strict */

import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  graphql,
} from 'graphql';

describe('mutation rules', () => {
  it('test nested mutations via aliases', async () => {
    const serialResults = [];
    const ArticleMutations = new GraphQLObjectType({
      name: 'ArticleMutations',
      fields: () => ({
        like: {
          type: GraphQLBoolean,
          args: { id: { type: GraphQLInt } },
          resolve: async (_, { id }) => {
            await new Promise(resolve => setTimeout(resolve, 100));
            serialResults.push(`like ${id} executed with timeout 100ms`);
            return true;
          },
        },
        unlike: {
          type: GraphQLBoolean,
          args: { id: { type: GraphQLInt } },
          resolve: async (_, { id }) => {
            await new Promise(resolve => setTimeout(resolve, 5));
            serialResults.push(`unlike ${id} executed with timeout 5ms`);
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

    await graphql({
      schema,
      source: `
      mutation {
        op1: article { like(id: 1) }
        op2: article { like(id: 2) }
        op3: article { unlike(id: 3) }
        op4: article { like(id: 4) }
      }
    `,
    });
    expect(serialResults).toEqual([
      'like 1 executed with timeout 100ms',
      'like 2 executed with timeout 100ms',
      'unlike 3 executed with timeout 5ms',
      'like 4 executed with timeout 100ms',
    ]);
  });
});
