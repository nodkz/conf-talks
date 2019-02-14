# graphql-compose

`yarn install graphql-compose`

-----

### [graphql-compose](https://github.com/graphql-compose/graphql-compose) позволяет конструировать схемы несколькими способами:

- как в `graphql` с кучей синтаксического сахара
- как в `graphql-tools` через SDL и резолверы.

-----

### Но самое главное `graphql-compose`, <br/>позволяет  модифицировать типы, <br/>перед тем как будет построена GraphQL-схема.

-----

### Это открывает возможности:

- генерировать ваши схемы
- комбинировать несколько схем
- либо редактировать уже существующие (например генерировать урезанную публичную схему из полной админской).

-----

### 1. Импортируем нужные классы

```js
import { TypeComposer, schemaComposer } from 'graphql-compose';
import { authors, articles } from './data';

```

-----

### 2. Cоздаем тип для `Автора` с помощью SDL

```js
const AuthorType = TypeComposer.create(`
  "Author data"
  type Author {
    id: Int
    name: String
  }
`);

```

-----

### 3. Cоздаем тип для `Статьи`

<div class="code-500">

```js
const ArticleType = TypeComposer.create({
  name: 'Article',
  description: 'Article data with related Author data',
  fields: {
    title: 'String!',
    text: 'String',
    authorId: {
      type: 'Int!',
      description: 'Record id from Author table',
    },
    author: {
      type: () => AuthorType,
      resolve: source => {
        const { authorId } = source;
        return authors.find(o => o.id === authorId);
      },
    },
  },
});

```

</div>

<span class="fragment" data-code-focus="5-10" />
<span class="fragment" data-code-focus="12" />

-----

### 4. Описываем точку входа – `Query`

<div class="code-500">

```js
schemaComposer.Query.addFields({
  authors: {
    type: [AuthorType], // замениться на `new GraphQLList(ArticleType)`
    resolve: () => authors,
  },
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
});

```

</div>

<span class="fragment" data-code-focus="1" />
<span class="fragment" data-code-focus="3" />

-----

### 5. Теперь можно построить экземпляр схемы

```js
const schema = schemaComposer.buildSchema();

export default schema;

```

-----

`graphql-compose`

Смотрите полный код примера [по ссылке](https://github.com/nodkz/conf-talks/blob/master/articles/graphql/schema-build-ways/graphql-compose.js)

-----

### Бонус-трек:

### миграция с `graphql-tools` на `graphql-compose`

<br/>

```diff
- import { makeExecutableSchema } from 'graphql-tools';
+ import { schemaComposer } from 'graphql-compose';

- const schema = makeExecutableSchema({
-  typeDefs,
-  resolvers,
- });
+ schemaComposer.addTypeDefs(typeDefs);
+ schemaComposer.addResolveMethods(resolvers);
+ const schema = schemaComposer.buildSchema();

```
