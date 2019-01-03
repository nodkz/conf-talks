/* @flow strict */

import {
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLUnionType,
  GraphQLInterfaceType,
  GraphQLList,
  GraphQLNonNull,
  graphql,
} from 'graphql';

describe('check different Error approaches', () => {
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

  it('throw error with extensions in resolve method', async () => {
    const schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Query',
        fields: {
          search: {
            resolve: () => {
              const e: any = new Error('Some error');
              e.extensions = { a: 1, b: 2 }; // will be passed in GraphQL-response
              e.someOtherData = { c: 3, d: 4 }; // will be omitted
              throw e;
            },
            type: GraphQLString,
          },
        },
      }),
    });

    const res = await graphql({
      schema,
      source: `query { search }`,
    });

    // console.log(JSON.stringify(res));
    expect(res).toEqual({
      errors: [
        {
          message: 'Some error',
          locations: [{ line: 1, column: 9 }],
          path: ['search'],
          extensions: { a: 1, b: 2 },
        },
      ],
      data: { search: null },
    });
  });

  it('errors (PROBLEMS) via Union-type', async () => {
    // Define our models
    class Video {
      title: string;
      url: string;

      constructor({ title, url }) {
        this.title = title;
        this.url = url;
      }
    }

    class VideoInProgressProblem {
      estimatedTime: number;
      constructor({ estimatedTime }) {
        this.estimatedTime = estimatedTime;
      }
    }

    class VideoNeedBuyProblem {
      price: number;
      constructor({ price }) {
        this.price = price;
      }
    }

    class VideoApproveAgeProblem {
      minAge: number;
      constructor({ minAge }) {
        this.minAge = minAge;
      }
    }

    // Define GraphQL types for our models
    const VideoType = new GraphQLObjectType({
      name: 'Video',
      fields: () => ({
        title: { type: GraphQLString },
        url: { type: GraphQLString },
      }),
    });

    const VideoInProgressProblemType = new GraphQLObjectType({
      name: 'VideoInProgressProblem',
      fields: () => ({
        estimatedTime: { type: GraphQLInt },
      }),
    });

    const VideoNeedBuyProblemType = new GraphQLObjectType({
      name: 'VideoNeedBuyProblem',
      fields: () => ({
        price: { type: GraphQLInt },
      }),
    });

    const VideoApproveAgeProblemType = new GraphQLObjectType({
      name: 'VideoApproveAgeProblem',
      fields: () => ({
        minAge: { type: GraphQLInt },
      }),
    });

    // Create our Union type which returns different ObjectTypes
    const VideoResultType = new GraphQLUnionType({
      name: 'VideoResult',
      types: () => [
        VideoType,
        VideoInProgressProblemType,
        VideoNeedBuyProblemType,
        VideoApproveAgeProblemType,
      ],
      resolveType: value => {
        if (value instanceof Video) {
          return VideoType;
        } else if (value instanceof VideoInProgressProblem) {
          return VideoInProgressProblemType;
        } else if (value instanceof VideoNeedBuyProblem) {
          return VideoNeedBuyProblemType;
        } else if (value instanceof VideoApproveAgeProblem) {
          return VideoApproveAgeProblemType;
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
            type: new GraphQLList(VideoResultType),
            resolve: () => {
              return [
                new Video({ title: 'DOM2 in the HELL', url: 'https://url' }),
                new VideoApproveAgeProblem({ minAge: 21 }),
                new VideoNeedBuyProblem({ price: 10 }),
                new VideoInProgressProblem({ estimatedTime: 220 }),
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
          list {
            __typename # <----- магическое поле, которое вернет имя типа для каждой записи
            ...on Video {
              title
              url
            }
            ...on VideoInProgressProblem {
              estimatedTime
            }
            ...on VideoNeedBuyProblem {
              price
            }
            ...on VideoApproveAgeProblem {
              minAge
            }
          }
        }
      `,
    });
    expect(res).toEqual({
      data: {
        list: [
          { __typename: 'Video', title: 'DOM2 in the HELL', url: 'https://url' },
          { __typename: 'VideoApproveAgeProblem', minAge: 21 },
          { __typename: 'VideoNeedBuyProblem', price: 10 },
          { __typename: 'VideoInProgressProblem', estimatedTime: 220 },
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

  it('validation query response with NonNull', async () => {
    const schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Query',
        fields: {
          ooops: {
            type: new GraphQLList(new GraphQLNonNull(GraphQLString)),
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
      data: { ooops: null },
    });
  });

  it('Errors for mutation with Union&Interfaces', async () => {
    const PostType = new GraphQLObjectType({
      name: 'Post',
      fields: {
        id: { type: GraphQLInt },
        title: { type: GraphQLString },
        likes: { type: GraphQLInt },
      },
    });

    const ProblemInterface = new GraphQLInterfaceType({
      name: 'ProblemInterface',
      fields: { message: { type: new GraphQLNonNull(GraphQLString) } },
      resolveType: value => {
        if (value && value.name) return value.name;
        return null;
      },
    });

    const SpikeProtectionProblem = new GraphQLObjectType({
      name: 'SpikeProtectionProblem',
      interfaces: [ProblemInterface],
      fields: () => ({
        message: { type: new GraphQLNonNull(GraphQLString) },
        wait: {
          description: 'Timout in seconds when the next operation will be executed without errors',
          type: new GraphQLNonNull(GraphQLInt),
        },
      }),
    });

    const PostDoesNotExistsProblem = new GraphQLObjectType({
      name: 'PostDoesNotExistsProblem',
      interfaces: [ProblemInterface],
      fields: () => ({
        message: { type: new GraphQLNonNull(GraphQLString) },
        postId: { type: new GraphQLNonNull(GraphQLInt) },
      }),
    });

    const LikePostProblems = new GraphQLUnionType({
      name: 'LikePostProblems',
      types: () => [SpikeProtectionProblem, PostDoesNotExistsProblem],
      resolveType: value => {
        if (value && value.name) return value.name;
        return null;
      },
    });

    const schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Query',
        fields: {
          hello: { type: GraphQLString, resolve: () => 'world' },
        },
      }),
      mutation: new GraphQLObjectType({
        name: 'Mutation',
        fields: {
          likePost: {
            type: new GraphQLObjectType({
              name: 'LikePostPayload',
              fields: {
                record: { type: PostType },
                recordId: { type: GraphQLInt },
                errors: { type: new GraphQLList(new GraphQLNonNull(LikePostProblems)) },
              },
            }),
            args: { id: { type: new GraphQLNonNull(GraphQLInt) } },
            resolve: async (_, { id }) => {
              if (id === 666) {
                return {
                  record: { id, title: `Post ${id}`, likes: 0 },
                  recordId: id,
                  errors: [
                    {
                      name: 'PostDoesNotExistsProblem',
                      message: 'Post does not exists!',
                      postId: id,
                    },
                    {
                      name: 'SpikeProtectionProblem',
                      message: 'Spike protection! Please retry later!',
                      wait: 20,
                    },
                  ],
                };
              }

              return {
                record: { id, title: `Post ${id}`, likes: 15 },
                recordId: id,
                errors: null,
              };
            },
          },
        },
      }),
    });

    expect(
      await graphql(
        schema,
        `
          mutation {
            likePost(id: 10) {
              recordId
              record {
                title
                likes
              }
              errors {
                __typename
              }
            }
          }
        `
      )
    ).toEqual({
      data: { likePost: { record: { likes: 15, title: 'Post 10' }, recordId: 10, errors: null } },
    });

    // Query with any type of error
    expect(
      await graphql(
        schema,
        `
          mutation {
            likePost(id: 666) {
              recordId
              record {
                title
                likes
              }
              errors {
                __typename
                ... on ProblemInterface {
                  message
                }
                ... on SpikeProtectionProblem {
                  message
                  wait
                }
                ... on PostDoesNotExistsProblem {
                  message
                  postId
                }
              }
            }
          }
        `
      )
    ).toEqual({
      data: {
        likePost: {
          errors: [
            {
              __typename: 'PostDoesNotExistsProblem',
              message: 'Post does not exists!',
              postId: 666,
            },
            {
              __typename: 'SpikeProtectionProblem',
              message: 'Spike protection! Please retry later!',
              wait: 20,
            },
          ],
          record: { likes: 0, title: 'Post 666' },
          recordId: 666,
        },
      },
    });
  });
});
