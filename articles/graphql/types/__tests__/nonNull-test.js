/* @flow strict */

import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  graphql,
} from 'graphql';

describe('check how works GraphQLNonNull', () => {
  it('should throw error if value does not provided', async () => {
    const schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Query',
        fields: {
          load: {
            type: GraphQLString,
            resolve: (_, { limit }) => `limit=${limit}`,
            args: {
              limit: {
                type: new GraphQLNonNull(GraphQLInt),
              },
            },
          },
        },
      }),
    });

    expect(await graphql(schema, 'query { load(limit: 15) }')).toEqual({
      data: { load: 'limit=15' },
    });

    expect(await graphql(schema, 'query { load }')).toEqual({
      errors: [
        expect.objectContaining({
          message: 'Field "load" argument "limit" of type "Int!" is required but not provided.',
        }),
      ],
    });
  });

  it('should work with default value if value does not provided', async () => {
    const schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Query',
        fields: {
          load: {
            type: GraphQLString,
            resolve: (_, { limit }) => `limit=${limit}`,
            args: {
              limit: {
                type: new GraphQLNonNull(GraphQLInt),
                defaultValue: 10,
              },
            },
          },
        },
      }),
    });

    expect(await graphql(schema, 'query { load }')).toEqual({ data: { load: 'limit=10' } });

    expect(await graphql(schema, 'query { load(limit: 15) }')).toEqual({
      data: { load: 'limit=15' },
    });

    expect(await graphql(schema, 'query { load(limit: null) }')).toEqual({
      errors: [
        expect.objectContaining({
          message: 'Expected type Int!, found null.',
        }),
      ],
    });
  });
});
