import { ApolloServer } from 'apollo-server';
import { objectType, queryType, intArg, makeSchema } from 'nexus';
import { authors, articles } from './data';

const Author = objectType({
  name: 'Author',
  definition(t) {
    t.int('id', { nullable: true });
    t.string('name', { nullable: true });
  },
});

const Article = objectType({
  name: 'Article',
  definition(t) {
    t.string('title');
    t.string('text', { nullable: true });
    t.int('authorId', { description: 'Record id from Author table' });
    t.field('author', {
      nullable: true,
      type: 'Author',
      resolve: source => {
        const { authorId } = source;
        return authors.find(o => o.id === authorId) as any;
      },
    });
  },
});

const Query = queryType({
  definition(t) {
    t.list.field('articles', {
      nullable: true,
      type: Article,
      args: {
        limit: intArg({ default: 3, required: true })
      },
      resolve: (_, args) => {
        const { limit } = args;
        return articles.slice(0, limit);
      },
    });
    t.list.field('authors', {
      nullable: true,
      type: Author,
      resolve: () => authors,
    });
  },
});

const schema = makeSchema({
  types: [Query, Article, Author],
  outputs: {
    schema: __dirname + '/nexus-generated/schema.graphql',
    typegen: __dirname + '/nexus-generated/typings.ts',
  },
});

const server = new ApolloServer({ schema });
server.listen(5000).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

