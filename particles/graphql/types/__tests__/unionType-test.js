/* @flow strict */

import {
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLUnionType,
  graphql,
} from 'graphql';

describe('check how works GraphQLUnionType', () => {
  it('scalar types cannot be used with UnionType', async () => {
    const ScalarUnionType = new GraphQLUnionType({
      name: 'ScalarUnion',
      description: '',
      types: () => [GraphQLInt, GraphQLString],
      resolveType: value => {
        if (typeof value === 'string') {
          return GraphQLString;
        } else if (typeof value === 'number') {
          return GraphQLInt;
        }
        return null;
      },
    });

    const schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Query',
        fields: {
          search: {
            type: ScalarUnionType,
            resolve: () => ['ok', 1, 2, 'good'],
          },
        },
      }),
    });

    const res = await graphql({
      schema,
      source: `
        query {
          search
        }
      `,
    });
    expect(res.errors[0].message).toEqual(
      'Union type ScalarUnion can only include Object types, it cannot include Int.'
    );
  });
});
