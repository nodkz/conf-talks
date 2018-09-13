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
  it('demo query', async () => {
    // Define our models
    class Article {
      title: string;
      publishDate: string;

      constructor(title, publishDate) {
        this.title = title;
        this.publishDate = publishDate;
      }
    }

    class Comment {
      text: string;
      author: string;

      constructor(text, author) {
        this.text = text;
        this.author = author;
      }
    }

    class UserProfile {
      nickname: string;
      age: number;

      constructor(nickname, age) {
        this.nickname = nickname;
        this.age = age;
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

    const CommentType = new GraphQLObjectType({
      name: 'Comment',
      fields: () => ({
        text: { type: GraphQLString },
        author: { type: GraphQLString },
      }),
    });

    const UserProfileType = new GraphQLObjectType({
      name: 'UserProfile',
      fields: () => ({
        nickname: { type: GraphQLString },
        age: { type: GraphQLInt },
      }),
    });

    // Create our Union type which returns different ObjectTypes
    const SearchRowType = new GraphQLUnionType({
      name: 'SearchRow',
      description:
        'Search item which can be one of the following types: Article, Comment, UserProfile',
      types: () => [ArticleType, CommentType, UserProfileType],
      resolveType: value => {
        if (value instanceof Article) {
          return ArticleType;
        } else if (value instanceof Comment) {
          return CommentType;
        } else if (value instanceof UserProfile) {
          return UserProfileType;
        }
        return null;
      },
    });

    // Define some working schema with mock data
    const schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Query',
        fields: {
          search: {
            type: new GraphQLList(SearchRowType),
            args: {
              q: { type: GraphQLString },
            },
            resolve: () => [
              new Article('Article 1', '2018-09-10'),
              new Comment('Comment 1', 'Author 1'),
              new UserProfile('Nick 1', 20),
              new Article('Article 2', '2018-01-12'),
              new Comment('Comment 2', 'Author 2'),
              { some: 'strange object' },
            ],
          },
        },
      }),
    });

    const res = await graphql({
      schema,
      source: `
        query {
          search(q: "text") {
            __typename # <----- магическое поле, которое вернет имя типа для каждой записи
            ...on Article {
              title
              publishDate
            }
            ...on Comment {
              text
              author
            }
            ...on UserProfile {
              nickname
              age
            }
          }
        }
      `,
    });
    expect(res.data).toEqual({
      search: [
        { __typename: 'Article', publishDate: '2018-09-10', title: 'Article 1' },
        { __typename: 'Comment', author: 'Author 1', text: 'Comment 1' },
        { __typename: 'UserProfile', age: 20, nickname: 'Nick 1' },
        { __typename: 'Article', publishDate: '2018-01-12', title: 'Article 2' },
        { __typename: 'Comment', author: 'Author 2', text: 'Comment 2' },
        null, // <------- object with wrong type will be returned as null
      ],
    });
  });

  it('scalar types CANNOT be used with UnionType', async () => {
    const ScalarUnionType = new GraphQLUnionType({
      name: 'ScalarUnion',
      description: '',
      types: (): any => [GraphQLInt, GraphQLString],
      resolveType: value => {
        if (typeof value === 'string') {
          // $FlowFixMe
          return GraphQLString;
        } else if (typeof value === 'number') {
          // $FlowFixMe
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

    const res: any = await graphql({
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
