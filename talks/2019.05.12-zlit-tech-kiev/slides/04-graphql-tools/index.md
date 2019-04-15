# graphql-tools

`yarn install graphql-tools`

-----

### С помощью [graphql-tools](https://github.com/apollographql/graphql-tools) вы отдельно описываете `типы` (в SDL) и `резолверы` (методы бизнес логики), а потом все склеиваете.

-----

Решение от `Apollo`. Самый легкий способ въехать в мир GraphQL. Идеален для маленьких и средних схем.

-----

### 1. Импортируем нужные классы

```js
import { makeExecutableSchema } from 'graphql-tools';
import { authors, articles } from './data';

```

-----

### 2. Описываем типы в `SDL`

```js
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

```

<span class="fragment" data-code-focus="2-6" />
<span class="fragment" data-code-focus="8-15" />
<span class="fragment" data-code-focus="17-20" />

-----

### 3. Описываем резолверы

```js
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

```

-----

### 4. Теперь можно построить экземпляр схемы

```js
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default schema;

```

-----

`graphql-tools`

Смотрите полный код примера [по ссылке](https://github.com/nodkz/conf-talks/blob/master/articles/graphql/schema-build-ways/graphql-tools.js)

<br/>

А еще есть [бонус-трек](https://github.com/nodkz/conf-talks/tree/master/articles/graphql/schema-build-ways#graphql-tools) по статическому анализу резолверов.