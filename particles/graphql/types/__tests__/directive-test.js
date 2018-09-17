/* @flow strict */

import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLDirective,
  DirectiveLocation,
  GraphQLNonNull,
  GraphQLList,
  graphql,
} from 'graphql';
import GraphQLJSON from 'graphql-type-json';

describe('check how works GraphQLDirective', () => {
  it('demo directive at BUILD', async () => {
    const DefaultValueDirective = new GraphQLDirective({
      name: 'default',
      description: 'Provides default value for input field.',
      locations: [DirectiveLocation.INPUT_FIELD_DEFINITION],
      args: {
        value: {
          type: new GraphQLNonNull(GraphQLJSON),
        },
      },
    });

    const schema = new GraphQLSchema({
      directives: [DefaultValueDirective],
    });

    // no proper example for directive with native `graphql` package on schema construction
    // due to feature block by Lee Byron (https://github.com/graphql/graphql-js/issues/1262#issuecomment-368110891)

    // But if you write own wrapper over `graphql` package, something like `graphql-compose`
    // you may see following realization https://github.com/graphql-compose/graphql-compose/commit/5478dd4216b4135442b3219c5df808fef26e5c4b

    expect(schema).toBeInstanceOf(GraphQLSchema);
    expect(DefaultValueDirective).toBeInstanceOf(GraphQLDirective);
  });

  it('demo directive at RUNTIME', async () => {
    const UppercaseDirective = new GraphQLDirective({
      name: 'uppercase',
      description: 'Provides default value for input field.',
      locations: [DirectiveLocation.FIELD],
    });

    const AuthorType = new GraphQLObjectType({
      name: 'Author',
      description: 'Author data with related data',
      fields: () => ({
        id: { type: GraphQLInt },
        name: {
          type: GraphQLString,
          resolve: (source, args, context, info) => {
            if (info.fieldNodes?.[0].directives?.[0]?.name?.value === 'uppercase') {
              return source.name.toUpperCase();
            }
            return source.name;
          },
        },
      }),
    });

    // Define some working schema with mock data
    const schema = new GraphQLSchema({
      directives: [UppercaseDirective],
      query: new GraphQLObjectType({
        name: 'Query',
        fields: {
          authors: {
            type: new GraphQLList(AuthorType),
            resolve: () => {
              return [
                { id: 1, name: 'Author 1' },
                { id: 2, name: 'Author 2' },
                { id: 3, name: 'Author 3' },
              ];
            },
          },
        },
      }),
    });

    const res = await graphql({
      schema,
      source: `
        query {
          authors {
            id
            name
            nameWithDirective: name @uppercase
          }
        }
      `,
    });
    expect(res).toEqual({
      data: {
        authors: [
          { id: 1, name: 'Author 1', nameWithDirective: 'AUTHOR 1' },
          { id: 2, name: 'Author 2', nameWithDirective: 'AUTHOR 2' },
          { id: 3, name: 'Author 3', nameWithDirective: 'AUTHOR 3' },
        ],
      },
    });
  });
});
