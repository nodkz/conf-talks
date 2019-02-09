# 4 подхода к построению схем

![Диаграмма экосистемы](./diagram-ecosystem-schema.svg) <!-- .element: style="width: 90vw;" class="plain"  -->

-----

- `graphql` — жестко и квадратно, нельзя редактировать типы (2012/2015).
- `graphql-tools` — описываете типы в SDL и отдельно резолверы (2016 Apr).
- `graphql-compose` — упрощенный синтаксис создания типов, можно использовать SDL. Позволяет читать и редактировать типы. Удобно для написания собственных функций генераторов (2016 Jul).
- `type-graphql` — использует декораторы поверх ваших классов на TypeScript (2018 Feb).
- `nexus` - только из печки, GraphQL Nexus (2018 Nov).

-----

### `graphql` — vanilla

```js
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} from 'graphql';
import { authors, articles } from './data';

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  description: 'Author data',
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
  }),
});

const ArticleType = new GraphQLObjectType({
  name: 'Article',
  description: 'Article data with related Author data',
  fields: () => ({
    title: {
      type: new GraphQLNonNull(GraphQLString),
    },
    text: {
      type: GraphQLString,
    },
    authorId: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'Record id from Author table',
    },
    author: {
      type: AuthorType,
      resolve: source => {
        const { authorId } = source;
        return authors.find(o => o.id === authorId);
      },
    },
  }),
});

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    articles: {
      args: {
        limit: { type: GraphQLInt, defaultValue: 3 },
      },
      type: new GraphQLList(ArticleType),
      resolve: (_, args) => {
        const { limit } = args;
        return articles.slice(0, limit);
      },
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve: () => authors,
    },
  },
});

const schema = new GraphQLSchema({
  query: Query,
});

export default schema;

```

[https://github.com/graphql/graphql-js](https://github.com/graphql/graphql-js)

<span class="fragment" data-code-focus="1-9" />
<span class="fragment" data-code-focus="11-18" />
<span class="fragment" data-code-focus="20-34" />
<span class="fragment" data-code-focus="44-58" />
<span class="fragment" data-code-focus="64-68" />

-----

### `graphql-tools` — typeDefs & resolvers

```js
import { makeExecutableSchema } from 'graphql-tools';
import { authors, articles } from './data';

const typeDefs = `
  "Author data"
  type Author {
    id: Int
    name: String
  }

  "Article data with related Author data"
  type Article {
    title: String!
    text: String
    "Record id from Author table"
    authorId: Int!
    author: Author
  }

  type Query {
    articles(limit: Int = 10): [Article]
    authors: [Author]
  }
`;

const resolvers = {
  Article: {
    author: source => {
      const { authorId } = source;
      return authors.find(o => o.id === authorId);
    },
  },
  Query: {
    articles: (_, args) => {
      const { limit } = args;
      return articles.slice(0, limit);
    },
    authors: () => authors,
  },
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default schema;

```

[https://github.com/apollographql/graphql-tools](https://github.com/apollographql/graphql-tools)

<span class="fragment" data-code-focus="1-2" />
<span class="fragment" data-code-focus="5-9" />
<span class="fragment" data-code-focus="11-18" />
<span class="fragment" data-code-focus="20-23" />
<span class="fragment" data-code-focus="26-40" />
<span class="fragment" data-code-focus="42-47" />

-----

### `graphql-compose` — sugared vanilla + SDL

```js
import { TypeComposer, schemaComposer } from 'graphql-compose';
import { authors, articles } from './data';

// SDL
const AuthorType = TypeComposer.create(`
  "Author data"
  type Author {
    id: Int
    name: String
  }
`);

// Sugared vanilla
const ArticleType = TypeComposer.create({
  name: 'Article',
  description: 'Article data with related Author data',
  fields: {
    title: 'String!',
    text: 'String',
    authorId: 'Int!',
    author: {
      type: () => AuthorType,
      resolve: source => {
        const { authorId } = source;
        return authors.find(o => o.id === authorId);
      },
    },
  },
});

schemaComposer.Query.addFields({
  articles: {
    args: {
      limit: { type: 'Int', defaultValue: 3 },
    },
    type: [ArticleType],
    resolve: (_, args) => {
      const { limit } = args;
      return articles.slice(0, limit);
    },
  },
  authors: {
    type: [AuthorType],
    resolve: () => authors,
  },
});

const schema = schemaComposer.buildSchema();

export default schema;

```

[https://github.com/graphql-compose/graphql-compose](https://github.com/graphql-compose/graphql-compose)

<span class="fragment" data-code-focus="1-2" />
<span class="fragment" data-code-focus="4-11" />
<span class="fragment" data-code-focus="13-27" />
<span class="fragment" data-code-focus="31-45" />
<span class="fragment" data-code-focus="48-50" />

-----

### `type-graphql` — decorators (TypeScript)

```js
import 'reflect-metadata';
import {
  ObjectType, Field, ID, String, type ResolverInterface,
} from 'type-graphql';
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

```

[https://github.com/19majkel94/type-graphql](https://github.com/19majkel94/type-graphql)

<span class="fragment" data-code-focus="1-5" />
<span class="fragment" data-code-focus="7-14" />
<span class="fragment" data-code-focus="16-30" />
<span class="fragment" data-code-focus="33-42" />

-----

`graphql-tools`, `graphql-compose`, `type-graphql`

только строят GraphQL-схему <!-- .element: class="fragment" -->

<span>с помощью пакета `graphql`</span> <!-- .element: class="fragment" -->

<div><hr />В runtime опять-таки используется <code>graphql</code></div> <!-- .element: class="fragment" -->

-----

### На закуску — Генераторы схем

### 🚜 🚜 🚜

-----

### Prisma

[Prisma](https://www.prisma.io/) — ORM прослойка на GraphQL, генерирует базу (Postgres, MySQL, more to come) и GraphQL API со всеми базовыми CRUD операциями. Дальше вы можете строить свой уникальный GraphQL API (используя подход `graphql-tools`), либо пользоваться уже сгенерированным.

-----

### Hasura

[Hasura](https://hasura.io/) — работает на интроспекции Postgres, плюс задает пермишенны и реляции между таблицами. Захотите свою кастомную схему, опять будете брать подход `graphql-tools` и ститчить (склеивать) вместе несколько схем, либо использовать [knex](https://github.com/tgriesser/knex) для хитрого получения данных.

-----

### graphql-compose-mongoose

[graphql-compose-mongoose](https://github.com/graphql-compose/graphql-compose-mongoose) — на базе ваших [mongoose-моделей](https://mongoosejs.com/) для MongoDB генерирует типы и резолверы (кусочки для схемы). А дальше вы с помощью подхода `graphql-compose` собираете свою схему сразу так, как вам нужно.

А еще есть [graphql-compose-elasticsearch](https://github.com/graphql-compose/graphql-compose-elasticsearch)
