# graphql-compose

`yarn install graphql-compose`

-----

### [graphql-compose](https://github.com/graphql-compose/graphql-compose) позволяет конструировать схемы несколькими способами:

- как в `graphql` с кучей синтаксического сахара
- как в `graphql-tools` через SDL и резолверы
- скоро через декораторы, почти как `type-graphql`

-----

### Фишки `graphql-compose`

- имеет свой регистр типов <!-- .element: class="fragment" -->
- позволяет модифицировать типы <!-- .element: class="fragment" -->
- писать собственные трансформеры/генераторы <!-- .element: class="fragment" -->
- он как babel позволяет трансформировать существующие схемы <!-- .element: class="fragment" -->
- сейчас в работе навернутый stitching-схем <!-- .element: class="fragment" -->

-----

### Это открывает возможности:

- генерировать ваши схемы
- либо редактировать уже существующие (например генерировать урезанную публичную схему из полной админской).
- комбинировать несколько схем

<span class="fragment green">Цель: из `graphql-compose` сделать `FFB` (frontend for backend) для микросервисной архитектуры (банки, корп.сектор, производство)</span>

-----

### 1. Импортируем нужные классы

```js
import { schemaComposer } from 'graphql-compose';
import { authors, articles } from './data';

```

-----

### 2. Cоздаем тип для `Автора` с помощью SDL

```js
const AuthorType = schemaComposer.createObjectTC(`
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
const ArticleType = schemaComposer.createObjectTC({
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

<span class="fragment">`addTypeDefs` и `addResolveMethods` вызывайте сколько хотите раз (удобно для модульных схем)
