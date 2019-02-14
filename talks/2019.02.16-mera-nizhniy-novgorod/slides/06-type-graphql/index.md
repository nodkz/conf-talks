# type-graphql

`yarn install type-graphql`

-----

### [type-graphql](https://github.com/19majkel94/type-graphql) – создает GraphQL-схему используя классы и декораторы (TypeScript only).

-----

### Из коробки предоставляются следующие виды декораторов:

- отметка типов, полей, аргументов и резолверов для построения GraphQL-схемы
- проверки прав доступа по ролям `@Authorized(["ADMIN", "MODERATOR"])`
- базовая валидация входящих аргументов `@MaxLength(30)`
- подсчета сложности запроса (Query Complexity) `@Field({ complexity: 2 })`

-----

### Правильно настраиваем `tsconfig.json`

```js
{
  "compilerOptions": {
    "target": "es6", // при es5 не работает
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
}

```

-----

Также необходимо использовать полифилл [reflect-metadata](https://github.com/rbuckton/reflect-metadata), который позволит использовать TypeScript дефинишены в рантайме.

Т.е. при построении GraphQL-схемы значения типов будут браться из тайпскрипта. 💪👌

-----

### 1. Импортируем нужные запчасти

```js
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

```

<span class="fragment" data-code-focus="1" />
<span class="fragment" data-code-focus="3-4" />
<span class="fragment" data-code-focus="5-12" />
<span class="fragment" data-code-focus="13-14" />

-----

### 2. Cоздаем класс для `Автора` и его резолвер

<div class="code-500">

```js
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

```

</div>

-----

### 3.1. Cоздаем класс для `Статьи`

<div class="code-500">

```js
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

```

</div>

<span class="fragment" data-code-focus="13" />

-----

### 3.2. Cоздаем класс резолвера для `Статьи`

<div class="code-500">

```js
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

```

</div>

-----

### 4. Теперь можно построить экземпляр схемы

```js
const schema = buildSchemaSync({
  resolvers: [ArticleResolver, AuthorResolver],
  // Or it may be a GLOB mask:
  // resolvers: [__dirname + '/**/*.ts'],
});

export default schema;

```

-----

`type-graphql`

Смотрите полный код примера [по ссылке](https://github.com/nodkz/conf-talks/blob/master/articles/graphql/schema-build-ways/type-graphql.ts)
