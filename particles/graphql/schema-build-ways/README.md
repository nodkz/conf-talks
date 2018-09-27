# 3 подхода построения GraphQL-схемы

На данный момент сущетвует три способа построения GraphQL-схемы в NodeJS:

- `graphql` - жесткий синтаксис создания объектов типов. Типы редактировать нельзя.
- `graphql-tools` - описываете отдельно типы (в SDL) и резолверы (методы бизнес логики), а потом все склеиваете через `makeExecutableSchema({ typeDefs, resolvers })`.
- `graphql-compose` - упрощенный синтаксис создания типов, можно использовать SDL. Позволяет читать и редактировать типы. Удобно для написания собственных функций генераторов.

Давай построим простую GraphQL-схему на каждом из этих подходов. Представим что у нас есть два типа `Author` и `Article` со следующими данными

```js
export const articles = [
  { title: 'Article 1', text: 'Text 1', authorId: 1 },
  { title: 'Article 2', text: 'Text 2', authorId: 1 },
  { title: 'Article 3', text: 'Text 3', authorId: 2 },
  { title: 'Article 4', text: 'Text 4', authorId: 3 },
  { title: 'Article 5', text: 'Text 5', authorId: 1 },
];

export const authors = [
  { id: 1, name: 'User 1' },
  { id: 2, name: 'User 2' },
  { id: 3, name: 'User 3' },
];
```

## graphql

Это базовая [реализация](https://github.com/graphql/graphql-js) спецификации GraphQL. Вы создаете свои типы, сразу указываете в них всю бизнес логику. Вы не можете редактировать и расширять типы. Пакету `graphql` это и не нужно. Его задача, жестко и квадратно задать конфигурацию схемы и уже быстро выполнять на ней запросы в рантайме.

Сперва вы импортируете нужные для вашей схемы классы типов:
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

Далее создаете тип для `Автора`:

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

Затем тип для `Статьи`. Особое внимание обратите на поле `author`, где используется созданный на предыдущем шаге тип `Автор` и указывается `resolve`-метод для получения данных автора согласно значению `Article.authorId`. Таким образом задается связь между двумя типами. В рамках REST API это бы звалось подзапросом - для каждой записи `Статьи` сделать подзапрос для получения данных `Автора`:

```js
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
```

После того как мы объявили узлы нашей схемы, нам надо описать вершину - точку входа. Корневой узел, который будет вам доступен на верхнем уровне вашей схемы для начала получения данных. Корневых узла в GraphQL-схеме три - это `Query`, `Mutation` и `Subscriptions`.

У нас схема простая - мы только читаем данные, поэтому объявляем только `Query`. Мы объявим два поля:

- `articles` - для получения Статей с возможностью указания лимита
- `authors` - для получения полного списка Авторов

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

Когда корневой тип `Query` создан, мы можем построить схему:

```js
const schema = new GraphQLSchema({
  query: Query,
});

export default schema;
```

Полный код построения схемы на подходе `graphql` доступен в [этом файле](./schema-via-graphql.js).

## graphql-tools

[graphql-tools](https://github.com/apollographql/graphql-tools) использует под собой `graphql`, только меняет принцип сборки вашей схемы. Вы отдельно объявляете все типы на SDL-языке (текстовый формат), и отдельно объявляете `resolve`-методы.

Вам нужно импортировать только метод `makeExecutableSchema`, который склеит ваши типы и resolve-методы:

```js
import { makeExecutableSchema } from 'graphql-tools';
import { authors, articles } from './data';
```

Дальше вы объявляете типы:

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

Затем для ключевых типов, вы объявляете методы получения данных. Объявляем как в типе `Article` надо получать автора, и как в корневом-типе `Query` получить список статей и авторов:

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

Ну а теперь после того, как есть описание `типов` и `resolve`-методы их надо склеить вместе, чтоб получить схему. `makeExecutableSchema` занимается именно этим, создавая под капотом объекты типов как бы мы это делали в самом первом подходе `graphql`:

```js
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default schema;
```

Полный код построения схемы на подходе `graphql-tools` доступен в [этом файле](./schema-via-graphql-tools.js).

## graphql-compose

[graphql-compose](https://github.com/graphql-compose/graphql-compose) - также под капотом использует построение типов как в первом подходе с помощью `graphql`. Но при этом добавляет синтаксического сахара при создании типов. И самое главное, позволяет  модифицировать типы, перед тем как будет построена GraphQL-схема.

Импортируем `TypeComposer` для построения узлов (промежуточных типов) и `schemaComposer` конструктор схемы:

```js
import { TypeComposer, schemaComposer } from 'graphql-compose';
import { authors, articles } from './data';
```

`TypeComposer` позволяет создать Object-тип с помощью SDL, как в `graphql-tools`. Давайте объявим простой тип `Author`:

```js
const AuthorType = TypeComposer.create(`
  "Author data"
  type Author {
    id: Int
    name: String
  }
`);
```

Также `TypeComposer` позволяет создать Object-тип как в подходе с `graphql` в формате `GraphQLObjectType`. Но при этом добавляя кучу сахара:

- `title` - объявляем тип поля сразу через SDL `String!`, под капотом замениться на `{ type: new GraphQLNonNull(GraphQLString) }`
- `authorId` - т.к. надо добавить дополнительное свойство, то конфигурация поля делается через объект, где `type` опять можно указать через SDL и при этом указать `description`
- `author` - тип поля можно указать через функцию. Позволяет бороться с hoisting-проблемой, когда у вас два типа импортируют друг от друга. В подходе `graphql` вы можете обернуть в функцию только все поля сразу, а т.к. `graphql-compose` позволяет читать и редактировать типы, то пришлось добавить эту возможность на уровень типа для каждого поля.

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

После того, как мы создали два типа `Author` и `Article` нам необходимо задать поля для корневого-типа `Query`. Т.к. этот тип в схеме один, то он сразу есть `schemaComposer.Query`. `Query` это инстанс `TypeComposer` и пришло время рассказать про редактирования типов. `TypeComposer` имеет много [полезных методов](https://graphql-compose.github.io/docs/en/api-TypeComposer.html#field-methods) по чтению и редактированию конфигурации GraphQL-типа. И в данном случае, мы просто воспользуемся методом `addFields`, чтобы добавить два новых поля `articles` и `authors`.

```js
schemaComposer.Query.addFields({
  articles: {
    args: {
      limit: { type: 'Int', defaultValue: 3 },
    },
    type: [ArticleType], // замениться на `new GraphQLList(ArticleType)`
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
```

Ну а после того как мы добавили необходимы поля в `Query`, можно сгенерировать `GraphQL`-схему:

```js
const schema = schemaComposer.buildSchema();

export default schema;
```

Полный код построения схемы на подходе `graphql-compose` доступен в [этом файле](./schema-via-graphql-compose.js).

## На закуску - Генераторы

Есть решения, которые позволяют вам генерировать схемы с уже имеющихся баз данных или ORM-моделей. Так или иниче, они используют один из трех подходов описанных выше.

- [Prisma](https://www.prisma.io/) - ORM прослойка на GraphQL, генерирует базу (Postgres, MySQL, more to come) и GraphQL API со всеми базовыми CRUD операциями. Дальше вы можете строить свой уникальный GraphQL API (используя подход `graphql-tools`), либо пользоваться уже сгенерированным.
- [Hasura](https://hasura.io/) - работает на интроспекции Postgres, плюс задает пермишенны и реляции между таблицами. Захотите свою кастомную схему, опять будите брать подход `graphql-tools` и ститчить (склеивать) вместе несколько схем, либо использовать [knex](https://github.com/tgriesser/knex) для хитрого получения данных.
- [graphql-compose-mongoose](https://github.com/graphql-compose/graphql-compose-mongoose) - на базе ваших [mongoose-моделей](https://mongoosejs.com/) для MongoDB генерирует типы и резолверы (кусочки для схемы). А дальше вы с помощью подхода `graphql-compose` собираете свою схему сразу так, как вам нужно.
- Есть что добавить? Откройте пожалуйста Pull Request.