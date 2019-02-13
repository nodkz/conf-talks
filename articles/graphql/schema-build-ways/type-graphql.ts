import { ApolloServer } from 'apollo-server';
import 'reflect-metadata';
import {
  // methods
  buildSchemaSync,
  // decorators
  Root,
  Query,
  ObjectType,
  Field,
  FieldResolver,
  Arg,
  Resolver,
  // types
  ID,
} from 'type-graphql';
import { authors, articles } from './data';

@ObjectType({ description: 'Author data' })
class Author {
  @Field(type => ID)
  id: number;

  @Field({ nullable: true })
  name: string;
}

@Resolver(of => Author)
class AuthorResolver {
  @Query(returns => [Author])
  authors(): Array<Author> {
    return authors as any;
  }
}

@ObjectType({ description: 'Article data with related Author data' })
class Article {
  @Field()
  title: string;

  @Field({ nullable: true })
  text: string;

  @Field(type => ID)
  authorId: number;

  @Field({ nullable: true })
  author: Author;
}

@Resolver(of => Article)
class ArticleResolver {
  @Query(returns => [Article])
  articles(@Arg('limit', { nullable: true, defaultValue: 3 }) limit: number): Array<Article> {
    return articles.slice(0, limit) as any;
  }

  @FieldResolver()
  author(@Root() article: Article) {
    return authors.find(o => o.id === article.authorId);
  }
}

const schema = buildSchemaSync({
  resolvers: [ArticleResolver, AuthorResolver],
  // Or it may be a GLOB mask:
  // resolvers: [__dirname + '/**/*.ts'],
});

const server = new ApolloServer({ schema });
server.listen(5000).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
