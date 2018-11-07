/* @flow strict */

import {
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLUnionType,
  GraphQLList,
  graphql,
} from 'graphql';

describe('check how works GraphQLUnionType', () => {
  it('throw error in resolve method', async () => {
    const schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Query',
        fields: {
          search: {
            args: {
              q: { type: GraphQLString },
            },
            resolve: (_, args) => {
              if (!args.q) throw new Error('missing q');
              return { text: args.q };
            },
            type: new GraphQLObjectType({
              name: 'Record',
              fields: {
                text: {
                  type: GraphQLString,
                  resolve: source => source.text,
                },
              },
            }),
          },
        },
      }),
    });

    const res = await graphql({
      schema,
      source: `
        query {
          s1: search(q: "ok") { text }
          s2: search { text }
          s3: search(q: "good") { text }
        }
      `,
    });

    // console.log(JSON.stringify(res));
    expect(res).toEqual({
      errors: [{ message: 'missing q', locations: [{ line: 4, column: 11 }], path: ['s2'] }],
      data: { s1: { text: 'ok' }, s2: null, s3: { text: 'good' } },
    });
  });

  it('errors via Union-type', async () => {
    // Define our models
    class Article {
      title: string;
      publishDate: string;

      constructor(title, publishDate) {
        this.title = title;
        this.publishDate = publishDate;
      }
    }

    class ErrorNotFound {
      message: string;
      constructor(message) {
        this.message = message;
      }
    }

    class ErrorNoAccess {
      message: string;
      constructor(message) {
        this.message = message;
      }
    }

    // Define GraphQL types for our models
    const ArticleType = new GraphQLObjectType({
      name: 'Article',
      fields: () => ({
        title: { type: GraphQLString },
        publishDate: { type: GraphQLString },
      }),
    });

    const ErrorNotFoundType = new GraphQLObjectType({
      name: 'ErrorNotFound',
      fields: () => ({
        message: { type: GraphQLString },
      }),
    });

    const ErrorNoAccessType = new GraphQLObjectType({
      name: 'ErrorNoAccess',
      fields: () => ({
        message: { type: GraphQLString },
      }),
    });

    // Create our Union type which returns different ObjectTypes
    const ListResultType = new GraphQLUnionType({
      name: 'ListResult',
      description: 'List of items which can be one of the following types: Article, ErrorNotFound',
      types: () => [ArticleType, ErrorNotFoundType, ErrorNoAccessType],
      resolveType: value => {
        if (value instanceof Article) {
          return ArticleType;
        } else if (value instanceof ErrorNotFound) {
          return ErrorNotFoundType;
        } else if (value instanceof ErrorNoAccess) {
          return ErrorNoAccessType;
        }
        return null;
      },
    });

    // Define some working schema with mock data
    const schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Query',
        fields: {
          list: {
            type: new GraphQLList(ListResultType),
            args: {
              q: { type: GraphQLString },
            },
            resolve: () => {
              return [
                new Article('Article 1', '2018-09-10'),
                new ErrorNotFound('missing article'),
                new ErrorNoAccess('you should be owner'),
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
          list(q: "text") {
            __typename # <----- магическое поле, которое вернет имя типа для каждой записи
            ...on Article {
              title
              publishDate
            }
            ...on ErrorNotFound {
              message
            }
            ...on ErrorNoAccess {
              message
            }
          }
        }
      `,
    });
    expect(res).toEqual({
      data: {
        list: [
          { __typename: 'Article', publishDate: '2018-09-10', title: 'Article 1' },
          { __typename: 'ErrorNotFound', message: 'missing article' },
          { __typename: 'ErrorNoAccess', message: 'you should be owner' },
        ],
      },
    });
  });

  it('undefined is not a function', async () => {
    // Define some working schema with mock data
    const schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Query',
        fields: {
          wrong: {
            type: GraphQLString,
            resolve: () => {
              // $FlowFixMe
              return undefined();
            },
          },
          correct: {
            type: GraphQLString,
            resolve: () => 'ok',
          },
        },
      }),
    });

    const res = await graphql({
      schema,
      source: `
        query {
          wrong
          correct
        }
      `,
    });

    expect(res).toEqual({
      errors: [
        {
          message: 'undefined is not a function',
          locations: [{ line: 3, column: 11 }],
          path: ['wrong'],
        },
      ],
      data: { wrong: null, correct: 'ok' },
    });
  });

  it('validation query error', async () => {
    const schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Query',
        fields: {
          correct: {
            type: GraphQLString,
            args: {
              q: { type: GraphQLString },
            },
            resolve: () => 'ok',
          },
        },
      }),
    });

    const res = await graphql({
      schema,
      source: `
        query {
          wrong
          correct
        }
      `,
    });

    // console.log(JSON.stringify(res));
    expect(res).toEqual({
      errors: [
        {
          message: 'Cannot query field "wrong" on type "Query".',
          locations: [{ line: 3, column: 11 }],
        },
      ],
    });

    const res2 = await graphql({
      schema,
      source: `
        query ($q: String!) {
          correct(q: $q)
        }
      `,
    });

    // console.log(JSON.stringify(res2));
    expect(res2).toEqual({
      errors: [
        {
          message: 'Variable "$q" of required type "String!" was not provided.',
          locations: [{ line: 2, column: 16 }],
        },
      ],
    });
  });

  it('validation query response', async () => {
    const schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Query',
        fields: {
          ooops: {
            type: new GraphQLList(GraphQLString),
            resolve: () => ['ok', { hey: 'wrong non String value' }],
          },
        },
      }),
    });

    const res = await graphql(
      schema,
      `
        query {
          ooops
        }
      `
    );

    // console.log(JSON.stringify(res));
    expect(res).toEqual({
      errors: [
        {
          message: 'String cannot represent value: { hey: "wrong non String value" }',
          locations: [{ line: 3, column: 11 }],
          path: ['ooops', 1],
        },
      ],
      data: { ooops: ['ok', null] },
    });
  });
});
