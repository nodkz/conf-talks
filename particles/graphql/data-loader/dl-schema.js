// @flow

// Schema with DataLoader

import { GraphQLSchema, GraphQLList, GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql';
import DataLoader from 'dataloader';
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
      // WAS
      // resolve: source => {
      //   return authorModel.findById(source.authorId);
      // },
      // BECAME:
      resolve: (source, args, context, info) => {
        // See dl-server.js, there was created context = { dataloaders: new WeakMap() };
        const { dataloaders } = context;
        // init DataLoader once, if not exists
        // we use a MAGIC here
        // `Set.get(info.fieldNodes)` is unique for every field in the query
        // it helps to determine the same resolvers
        let dl = dataloaders.get(info.fieldNodes);
        if (!dl) {
          dl = new DataLoader(async (ids: any) => {
            // regular request to our database
            const rows = await authorModel.findByIds(ids);
            // IMPORTANT: we MUST return rows in the same order like we get ids
            const sortedInIdsOrder = ids.map(id => rows.find(x => x.id === id));
            return sortedInIdsOrder;
          });
          dataloaders.set(info.fieldNodes, dl);
        }
        // load author via dataloader
        return dl.load(source.authorId);
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
