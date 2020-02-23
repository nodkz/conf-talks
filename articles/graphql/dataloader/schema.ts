import { GraphQLSchema, GraphQLList, GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql';
import { articleModel, authorModel } from './data';

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
  }),
});

const ArticleType = new GraphQLObjectType({
  name: 'Article',
  fields: () => ({
    title: { type: GraphQLString },
    authorId: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve: (source) => {
        return authorModel.findById(source.authorId);
      },
    },
  }),
});

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      articles: {
        type: new GraphQLList(ArticleType),
        resolve: () => {
          return articleModel.findMany();
        },
      },
    },
  }),
});
