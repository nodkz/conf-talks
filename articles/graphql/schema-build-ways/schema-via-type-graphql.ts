import 'reflect-metadata';
import {
  ObjectType,
  Field,
  Arg,
  ID,
  Resolver,
  Query,
  FieldResolver,
  Root,
  buildSchemaSync,
} from 'type-graphql';
import { authors, articles } from './data';

@ObjectType({ description: 'Author data' })
class Author {
  @Field(type => ID)
  id: number;

  @Field(type => String, { nullable: true })
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
  @Field(type => String)
  title: string;

  @Field(type => String, { nullable: true })
  text: string;

  @Field(type => ID)
  authorId: number;

  @Field(type => Author, { nullable: true })
  author: Author;
}

@Resolver(of => Article)
class ArticleResolver {
  @Query(returns => [Article])
  articles(@Arg('limit', { nullable: true }) limit: number = 3): Array<Article> {
    return articles.slice(0, limit) as any;
  }

  @FieldResolver()
  author(@Root() article: Article) {
    return authors.find(o => o.id === article.authorId);
  }
}

const schema = buildSchemaSync({
  resolvers: [ArticleResolver, AuthorResolver],
});

export default schema;
