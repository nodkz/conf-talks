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

describe('list coercion', () => {
  it('test input list coercion', async () => {
    const schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Query',
        fields: {
          getById: {
            type: GraphQLString,
            args: {
              id: {
                type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLInt))),
              },
            },
            resolve: (_, args) => JSON.stringify(args.id),
          },
        },
      }),
    });

    const res = await graphql({
      schema,
      source: `
      query {
        op1: getById(id: 1)
        op2: getById(id: [1, 2, 3])
      }
    `,
    });
    expect(res.data).toEqual({ op1: '[1]', op2: '[1,2,3]' });

    const res2 = await graphql({
      schema,
      source: `
        query ($id: [Int!]!) {
          getById(id: $id)
        }
      `,
      variableValues: { id: 777 }, // Should be array, but pass just Int
    });
    expect(res2.data).toEqual({ getById: '[777]' });
  });
});
