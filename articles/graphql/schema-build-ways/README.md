# 5 подходов построения GraphQL-схем

На данный момент сущетвует 5 способов построения GraphQL-схем в NodeJS:

- [graphql](https://github.com/graphql/graphql-js) — жесткий синтаксис создания объектов типов. Типы редактировать нельзя. (2012/2015)
- [graphql-tools](https://github.com/apollographql/graphql-tools) — описываете отдельно типы (в SDL) и резолверы (методы бизнес логики), а потом все склеиваете через `makeExecutableSchema({ typeDefs, resolvers })`. (2016 Apr)
- [graphql-compose](https://github.com/graphql-compose/graphql-compose) — упрощенный синтаксис создания типов, можно использовать SDL. Позволяет читать и редактировать типы. Удобно для написания собственных функций генераторов. (2016 Jul)
- [type-graphql](https://github.com/19majkel94/type-graphql) — использует декораторы для описания типов поверх ваших классов и моделей (пока работает только c TypeScript). (2018 Feb)
- [nexus](https://github.com/graphql-nexus/nexus) – самый свежий подход с синтаксисом из 90-х (2018 Nov)

На мой вкус и на текущий момент самым крутым и продвинутым является [type-graphql](https://github.com/19majkel94/type-graphql) (по состоянию на апрель 2019).

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

Полный код построения схемы на подходе `graphql` доступен в [этом файле](./graphql.js).

## graphql-tools

[graphql-tools](https://github.com/apollographql/graphql-tools) использует под капотом `graphql`, только меняет принцип сборки вашей схемы. Вы отдельно объявляете все типы на SDL-языке (текстовый формат), и отдельно объявляете `resolve`-методы.

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

Полный код построения схемы на подходе `graphql-tools` доступен в [этом файле](./graphql-tools.js).

### Бонус статического анализа для `graphql-tools`

Рекомендую использовать пакет `graphql-code-generator`, который сможет вам генерировать тайпинги для резолверов исходя из SDL схемы.

Прописываете следующий конфиг `codegen.yml`:

```yaml
overwrite: true
schema: src/**/*.gql
documents: null
generates:
  src/__generated__/graphql.ts:
    plugins:
      - "typescript-common"
      - "typescript-server"
      - "typescript-resolvers"
  src/__generated__/schema.graphql.json:
    plugins:
      - "introspection"
  src/__generated__/schema.graphql:
    plugins:
      - "graphql-codegen-schema-ast"
```

Выполняете команду:

```bash
gql-gen --config codegen.yml
```

А потом облагораживаете свои резолверы следующим образом:

```js
import { IResolvers } from './__generated__/graphql';

const resolvers: IResolvers = {
  Article: {
    author: () => {},
  },
  Query: {
    articles: (_, args) => {},
    authors: () => authors,
  },
};
```

И получаете отменную проверку от TypeScript'а.

## graphql-compose

[graphql-compose](https://github.com/graphql-compose/graphql-compose) - под капотом использует `graphql`. При этом позволяет конструировать схемы несколькими способами:

- как в `graphql` с кучей синтаксического сахара при создании типов.
- как в `graphql-tools` описав типы через SDL и предоставив отдельно резолверы к ним.

Но самое главное `graphql-compose`, позволяет  модифицировать типы, перед тем как будет построена GraphQL-схема. Это открывает возможности генерировать ваши схемы, комбинировать несколько схем, либо редактировать уже существующие (например генерировать урезанную публичную схему из полной админской).

Строится GraphQL-схема следующим образом. Импортируем `schemaComposer` глобальный регистр типов, которые позволяет создавать новые типы множеством удобных способов:

```js
import { schemaComposer } from 'graphql-compose';
import { authors, articles } from './data';
```

Метод `createObjectTC()` позволяет создать Object-тип с помощью SDL, как в `graphql-tools`. Давайте объявим простой тип `Author`:

```js
const AuthorType = schemaComposer.createObjectTC(`
  "Author data"
  type Author {
    id: Int
    name: String
  }
`);
```

Также `createObjectTC()` позволяет создать Object-тип как в подходе с `graphql` в формате `GraphQLObjectType`. Но при этом добавляя кучу сахара:

- `title` - объявляем тип поля сразу через SDL `String!`, под капотом замениться на `{ type: new GraphQLNonNull(GraphQLString) }`
- `authorId` - т.к. надо добавить дополнительное свойство, то конфигурация поля делается через объект, где `type` опять можно указать через SDL и при этом указать `description`
- `author` - тип поля можно указать через функцию. Позволяет бороться с hoisting-проблемой, когда у вас два типа импортируют друг от друга. В подходе `graphql` вы можете обернуть в функцию только все поля сразу, а т.к. `graphql-compose` позволяет читать и редактировать типы, то пришлось добавить эту возможность на уровень типа для каждого поля.

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

После того, как мы создали два типа `Author` и `Article` нам необходимо задать поля для корневого-типа `Query`. Он уже сразу есть в схеме – `schemaComposer.Query`. `Query` это инстанс `ObjectTypeComposer` который можно редактировать, добавляя или удаляя существующие поля. `ObjectTypeComposer` имеет много [полезных методов](https://graphql-compose.github.io/docs/api/ObjectTypeComposer.html#field-methods) по чтению и редактированию конфигурации GraphQL-типа.

Чтобы добавить два новых поля `articles` и `authors`, мы воспользуемся методом `addFields()`:

```js
schemaComposer.Query.addFields({
  authors: {
    type: [AuthorType],
    resolve: () => authors,
  },
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
});
```

Ну а после того как мы добавили необходимы поля в `Query`, можно сгенерировать `GraphQL`-схему:

```js
const schema = schemaComposer.buildSchema();

export default schema;
```

Полный код построения схемы на подходе `graphql-compose` доступен в [этом файле](./graphql-compose.js).

### Миграция с graphql-tools на graphql-compose

Мигрировать с `graphql-tools` на `graphql-compose` и получить все плюшки редактирования, модификации и генерации типов достаточно просто:

```js
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

Методы `addTypeDefs` и `addResolveMethods` могут вызываться много раз, позволяя собирать ваши схемы из разных модулей.

Рабочий код можно посмотреть в [этом файле](./graphql-compose-sdl.js).

## type-graphql

[type-graphql](https://github.com/19majkel94/type-graphql) - создает GraphQL-схему используя классы и декораторы (пока работает только c TypeScript). Из коробки предоставляются следующие виды декораторов:

- отметка типов, полей, аргументов и резолверов для построения GraphQL-схемы
- проверки прав доступа по ролям `@Authorized(["ADMIN", "MODERATOR"])`
- базовая валидация входящих аргументов `@MaxLength(30)`
- подсчета сложности запроса (Query Complexity) `@Field({ complexity: 2 })`

Для работы с пакетом `type-graphql` необходимо использовать TypeScript c правильными настройками для декораторов в `tsconfig.json`:

```js
{
  "compilerOptions": {
    "target": "es6", // при es5 не работает
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
}
```

Также необходимо использовать полифилл [reflect-metadata](https://github.com/rbuckton/reflect-metadata), который позволит использовать TypeScript дефинишены в рантайме. Т.е. при построении GraphQL-схемы значения типов будут браться из тайпскрипта. Этот полифил подключается один раз в самом начале вашего кода.

Наш пример с Authors и Articles будет выглядеть следующим образом.

Сперва импортируем необходимые методы, декораторы и типы:

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

Строим класс `Author` из которого будет сгенерирован наш GraphQL-тип благодаря декораторам `@ObjectType` и `@Field`. И создадим класс c резолверами `AuthorResolver`, который в `Query` добавит поле `authors`:

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

Похожим образом добавим класс `Article` и `ArticleResolver`, только в резолвере помимо добавления поля в `Query` через `@Query` декоратор, будет еще использоваться `@FieldResolver()` декоратор для описания метода получения данных автора для поля `author`:

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

Ну и затем останется только собрать GraphQL-схему с помощью метода `buildSchemaSync`:

```js
const schema = buildSchemaSync({
  resolvers: [ArticleResolver, AuthorResolver],
  // Or it may be a GLOB mask:
  // resolvers: [__dirname + '/**/*.ts'],
});

export default schema;
```

Пример рабочего кода доступен в [этом файле](./type-graphql.ts).

## nexus

[nexus](https://github.com/prisma/nexus) – декларативный конструктор схемы со встроенным генератором дефинишенов для TypeScript. Продвигается [Prisma](https://prisma.io)'ой.

На данный момент чтобы заработали тайпинги, вы должны запустить сервер. Он будет генерировать вам дефинишены типов, которые будет подхватывать TypeScript. Поэтому для удобной работы в dev-режиме рекомендуется использовать [nodemon](https://nodemon.io/) или более шустрый [ts-node-dev](https://github.com/whitecolor/ts-node-dev) для перезапуска сервера при изменении файлов. Поменяли файл схемы, перезапустился сервер, перегенерились тайпинги, TypeScript подхватил изменения и перевалидировал код.

Для построения простой схемы `Article` и `Author` необходимо подключить пакет `nexus`:

```js
import { objectType, queryType, intArg, makeSchema } from 'nexus';
import { authors, articles } from './data';
```

Далее объявляем типы схемы очень интересным способом, используя функцию `objectType` для создания типов, в котором используется метод `definition(t)` для определения полей:

```js
const Author = objectType({
  name: 'Author',
  definition(t) {
    t.int('id', { nullable: true });
    t.string('name', { nullable: true });
  },
});

const Article = objectType({
  name: 'Article',
  definition(t) {
    t.string('title');
    t.string('text', { nullable: true });
    t.int('authorId', { description: 'Record id from Author table' });
    t.field('author', {
      nullable: true,
      type: 'Author',
      resolve: source => {
        const { authorId } = source;
        return authors.find(o => o.id === authorId) as any;
      },
    });
  },
});
```

А вот для конструирования корневых типов используется специальные функции, в нашем случае `queryType`:

```js
const Query = queryType({
  definition(t) {
    t.list.field('articles', {
      nullable: true,
      type: Article,
      args: {
        limit: intArg({ default: 3, required: true })
      },
      resolve: (_, args) => {
        const { limit } = args;
        return articles.slice(0, limit);
      },
    });
    t.list.field('authors', {
      nullable: true,
      type: Author,
      resolve: () => authors,
    });
  },
});
```

Ну а дальше используется метод `makeSchema` в который необходимо передать все инстансы наших типов – не очень удобно если в вашей схеме сотни типов. Наверняка в будущем придумают что-нибудь получше. Также вы обязательно должны передать пути, куда будут генерироваться тайпинги при запуске сервера:

```js
const schema = makeSchema({
  types: [Query, Article, Author],
  outputs: {
    schema: __dirname + '/nexus-generated/schema.graphql',
    typegen: __dirname + '/nexus-generated/typings.ts',
  },
});

export default schema;
```

Рабочий код можно посмотреть в [этом файле](./nexus.ts).

## В итоге что имеем по подходам

<table style="zoom: 0.6;">
<thead>
<tr>
<th></th>
<th align="center">graphql</th>
<th align="center">graphql-tools</th>
<th align="center">graphql-compose</th>
<th align="center">type-graphql</th>
<th align="center">nexus</th>
</tr>
</thead>
<tbody><tr>
<td>Дата создания</td>
<td align="center">2012/2015</td>
<td align="center">2016.04</td>
<td align="center">2016.07</td>
<td align="center">2018.02</td>
<td align="center">2018.11</td>
</tr>
<tr>
<td>GitHub starts</td>
<td align="center"><img src="https://img.shields.io/github/stars/graphql/graphql-js.svg?color=lightgrey" class="plain" style="max-height: 50px; height: 40px; vertical-align: middle;" /></td>
<td align="center"><img src="https://img.shields.io/github/stars/apollographql/graphql-tools.svg?color=lightgrey" class="plain" style="max-height: 50px; height: 40px; vertical-align: middle;" /></td>
<td align="center"><img src="https://img.shields.io/github/stars/graphql-compose/graphql-compose.svg?color=lightgrey" class="plain" style="max-height: 50px; height: 40px; vertical-align: middle;" /></td>
<td align="center"><img src="https://img.shields.io/github/stars/19majkel94/type-graphql.svg?color=lightgrey" class="plain" style="max-height: 50px; height: 40px; vertical-align: middle;" /></td>
<td align="center"><img src="https://img.shields.io/github/stars/prisma/nexus.svg?color=lightgrey" class="plain" style="max-height: 50px; height: 40px; vertical-align: middle;" /></td>
</tr>
<tr>
<td>NPM downloads</td>
<td align="center"><img src="https://img.shields.io/npm/dw/graphql.svg?color=lightgrey" class="plain" style="max-height: 50px; height: 40px; vertical-align: middle;" /></td>
<td align="center"><img src="https://img.shields.io/npm/dw/graphql-tools.svg?color=lightgrey" class="plain" style="max-height: 50px; height: 40px; vertical-align: middle;" /></td>
<td align="center"><img src="https://img.shields.io/npm/dw/graphql-compose.svg?color=lightgrey" class="plain" style="max-height: 50px; height: 40px; vertical-align: middle;" /></td>
<td align="center"><img src="https://img.shields.io/npm/dw/type-graphql.svg?color=lightgrey" class="plain" style="max-height: 50px; height: 40px; vertical-align: middle;" /></td>
<td align="center"><img src="https://img.shields.io/npm/dw/nexus.svg?color=lightgrey" class="plain" style="max-height: 50px; height: 40px; vertical-align: middle;" /></td>
</tr>
<tr>
<td>Язык для разработки схемы</td>
<td align="center">JS, TS, Flow</td>
<td align="center">JS, TS, Flow</td>
<td align="center">JS, TS, Flow</td>
<td align="center">TS</td>
<td align="center">JS, TS</td>
</tr>
<tr>
<td>Schema-first (SDL-first)</td>
<td align="center">-</td>
<td align="center">да</td>
<td align="center">да</td>
<td align="center">-</td>
<td align="center">-</td>
</tr>
<tr>
<td>Code-first</td>
<td align="center">да</td>
<td align="center">-</td>
<td align="center">да</td>
<td align="center">да</td>
<td align="center">да</td>
</tr>
<tr>
<td>Редактирование GraphQL-типов</td>
<td align="center">-</td>
<td align="center">-</td>
<td align="center">да</td>
<td align="center">-</td>
<td align="center">-</td>
</tr>
<tr>
<td>Статическая типизация в резолверах</td>
<td align="center">1/5<br/>нет</td>
<td align="center">3/5<br/>через сторонние пакеты</td>
<td align="center">2/5<br/>кроме аргументов</td>
<td align="center">5/5<br/>из коробки через рефлексию</td>
<td align="center">4/5<br/>через генерацию файлов из коробки</td>
</tr>
<tr>
<td>Простота в изучении</td>
<td align="center">3/5</td>
<td align="center">5/5</td>
<td align="center">2/5</td>
<td align="center">4/5</td>
<td align="center">4/5</td>
</tr>
<tr>
<td>Чистота в коде схемы</td>
<td align="center">1/5</td>
<td align="center">5/5</td>
<td align="center">4/5</td>
<td align="center">4/5</td>
<td align="center">3/5</td>
</tr>
<tr>
<td>Типы полей (модификатор по-умолчанию)</td>
<td align="center">optional</td>
<td align="center">optional</td>
<td align="center">optional</td>
<td align="center">Required</td>
<td align="center">Required</td>
</tr>
</tbody></table>

Также рекомендую прочитать хорошую статью [про разницу в подходах Schema-first и Code-first](https://www.prisma.io/blog/the-problems-of-schema-first-graphql-development-x1mn4cb0tyl3)

## На закуску — Генераторы

Есть решения, которые позволяют вам генерировать схемы с уже имеющихся баз данных или ORM-моделей. Это совершенно отдельная каста инструментов, и чистыми инструментами по созданию схем их уже назвать нельзя. Т.к. они ограничены БД/моделью – вы не конструируете схему, она для вас генерируется.

- [Prisma](https://www.prisma.io/) — ORM прослойка на GraphQL, генерирует базу (Postgres, MySQL, more to come) и GraphQL API со всеми базовыми CRUD операциями. Дальше вы можете строить свой уникальный GraphQL API (используя подход `graphql-tools`), либо пользоваться уже сгенерированным. Под капотом Scala.
- [Hasura](https://hasura.io/) — работает на интроспекции Postgres, плюс задает пермишенны и реляции между таблицами. Захотите свою кастомную схему, опять будите брать подход `graphql-tools` и ститчить (склеивать) вместе несколько схем, либо использовать [knex](https://github.com/tgriesser/knex) для хитрого получения данных. Под капотом Haskel.
- [postgraphile](https://www.graphile.org/postgraphile/) – работает на интроспекции Postgres, при этом автоматически следит за изменениями схемы БД. Через плагины позволяет контролировать конструирование типов. Под капотом JavaScript.
- [join-monster](https://join-monster.readthedocs.io/en/latest/) – превращает GraphQL-запрос в SQL-запрос. Не особо активно поддерживается. Некоторые люди жаловались на плохую производительность.
- [graphql-compose-mongoose](https://github.com/graphql-compose/graphql-compose-mongoose) — на базе ваших [mongoose-моделей](https://mongoosejs.com/) для MongoDB генерирует типы и резолверы (кусочки для схемы). А дальше вы с помощью подхода `graphql-compose` собираете свою схему сразу так, как вам нужно.

Обсуждение генераторов происходит [в этом issue](https://github.com/nodkz/conf-talks/issues/20).

Есть что добавить? Откройте пожалуйста Pull Request.
