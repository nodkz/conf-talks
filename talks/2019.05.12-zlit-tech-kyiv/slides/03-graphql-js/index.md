# graphql

`yarn install graphql`

-----

### Это базовая [реализация](https://github.com/graphql/graphql-js) спецификации GraphQL

-----

Задача пакета `graphql` жестко и квадратно задать конфигурацию схемы и уже быстро выполнять на ней запросы в рантайме.

-----

### 1. Импортируем нужные классы

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

```

-----

### 2. Cоздаем тип для `Автора`

```js
const AuthorType = new GraphQLObjectType({
  name: 'Author',
  description: 'Author data',
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
  }),
});

```

-----

### 3. Cоздаем тип для `Статьи`

<div class="code-500">

```js
const ArticleType = new GraphQLObjectType({
  name: 'Article',
  description: 'Article data with related Author data',
  fields: () => ({
    title: { type: new GraphQLNonNull(GraphQLString) },
    text: { type: GraphQLString },
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

```

</div>

<span class="fragment" data-code-focus="11-17" />

-----

### 4. Описываем точку входа – `Query`

```js
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

```

<span class="fragment" data-code-focus="4-13" />
<span class="fragment" data-code-focus="5-7" />
<span class="fragment" data-code-focus="8" />
<span class="fragment" data-code-focus="9-12" />
<span class="fragment" data-code-focus="14-17" />

-----

### 5. Теперь можно построить экземпляр схемы

```js
const schema = new GraphQLSchema({
  query: Query,
});

export default schema;

```

-----

`graphql`

Смотрите полный код примера [по ссылке](https://github.com/nodkz/conf-talks/blob/master/articles/graphql/schema-build-ways/graphql.js)
