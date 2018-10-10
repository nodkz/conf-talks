import 'reflect-metadata';
import { ObjectType, Field, ID, String, type ResolverInterface } from 'type-graphql';
import { authors, articles } from './data';

@ObjectType({ description: 'Author data' })
class Author {
  @Field(type => ID)
  id: number;

  @Field(type => String, { nullable: true })
  name: string;
}

@ObjectType({ description: 'Article data with related Author data' })
class Article {
  @Field(type => String)
  title: string;

  @Field(type => String, { nullable: true })
  text: string;

  @Field(type => ID)
  authorId: number;

  @Field(type => Author)
  get author(): ?Object {
    return authors.find(o => o.id === this.authorId);
  }
}

@Resolver(of => Article)
class ArticleResolver implements ResolverInterface<Article> {
  @Query(returns => [Article])

  // SyntaxError: Stage 2 decorators cannot be used to decorate parameters (36:17)
  // Waiting fresh Babel implementation for decorators plugin
  async articles(@Arg('limit') limit: string): Array<Article> {
    return articles.slice(0, limit);
  }
}

// schemaComposer.Query.addFields({
//   articles: {
//     args: {
//       limit: { type: 'Int', defaultValue: 3 },
//     },
//     type: [ArticleType],
//     resolve: (_, args) => {
//       const { limit } = args;
//       return articles.slice(0, limit);
//     },
//   },
//   authors: {
//     type: [AuthorType],
//     resolve: () => authors,
//   },
// });

// const schema = schemaComposer.buildSchema();

// export default schema;
