# GraphQL-сервер

![Диаграмма экосистемы](./diagram-ecosystem-server.svg) <!-- .element: style="width: 90vw;" class="plain"  -->

-----

![Диаграмма работы сервера](./diagram-server.svg) <!-- .element: style="width: 90vw;" class="plain"  -->
<!-- https://drive.google.com/file/d/1G-Iu_fZdrois9NZY1-5YGWNwELJEzy6Y/view?usp=sharing -->

-----

### Пакет `graphql` ничего не знает о сети, авторизации, не слушает никакой порт.

<pre><code>import { graphql } from 'graphql';
import { schema } from './your-schema';

const query = '{ hello }';
const result = await graphql(schema, query);
</code></pre>

-----

### т.к. GraphQL-сервер реализуется

### на другом уровне абстракции.

<br />
<br />

*в других пакетах*

-----

### Каковы обычно требования к серверу?

<br />
<br />

### По некому протоколу обслуживать множество запросов от разных клиентов. <!-- .element: class="fragment" -->

<br />
<br />

<span>Это может быть `http(s)` или `websockets`, либо вообще что-то экзотическое типа `ssh`, `telnet`.</span> <!-- .element: class="fragment" -->

-----

### Что должен делать HTTP-сервер

- открыть порт и слушать http-запросы от клиентов
- инициализировать GraphQL-схему
- вытаскивать GraphQL-запрос с переменными из полученных http-запросов
- формировать `context` с данными текущего пользователя и глобальными ресурсами
- отправить на выполнение GraphQL-схему, запрос и `context` в пакет `graphql`
- из полученных данных от `graphql` сформировать http-ответ и отправить клиенту

-----

### По-желанию попутно сделать всякие операции, типа:

- парсинга кук
- проверки токенов
- базовая авторизация
- превращение persistent query по id в GraphQL-запрос
- логирования запросов
- кеша запросов
- отлова ошибок и отправки их в систему мониторинга.

-----

### Популярные сервера:

- [express-graphql](https://github.com/graphql/express-graphql)
- [koa-graphql](https://github.com/chentsulin/koa-graphql)
- [apollo-server@1.x.x](https://github.com/apollographql/apollo-server/tree/version-1)
- [apollo-server@2.x.x](https://github.com/apollographql/apollo-server/tree/version-2)
- [graphql-yoga](https://github.com/prisma/graphql-yoga)

<br />
<br />

TL;DR: берите `apollo-server@2.x.x`

-----

### [express-graphql](https://github.com/graphql/express-graphql)

```js
import express from 'express';
import graphqlHTTP from 'express-graphql';
import schema from './schema';

const app = express();

app.use('/graphql', graphqlHTTP(req => async ({
  schema,
  graphiql: true,
  context: await prepareSomehowContextDataFromRequest(req),
})));

app.listen(3000);

```

Это даже не сервер, а `middleware` для `express`.

Минусы: ограничение запроса в 100kb, нет подписок.

-----

### [koa-graphql](https://github.com/chentsulin/koa-graphql)

```js
import Koa from 'koa';
import mount from 'koa-mount';
import graphqlHTTP from 'koa-graphql';
import schema from './schema';

const app = new Koa();

app.use(mount('/graphql', graphqlHTTP(req => async ({
  schema,
  graphiql: true,
  context: await prepareSomehowContextDataFromRequest(req),
}))));

app.listen(4000);

```

Такое же middleware как `express-graphql`, только для `Koa`

-----

### [apollo-server@1.x.x](https://github.com/apollographql/apollo-server/tree/version-1)

```js
import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import schema from './schema';

const app = express();
app.use('/graphql', bodyParser.json(), graphqlExpress(req => async ({
  schema,
  context: await prepareSomehowContextDataFromRequest(req),
}));
app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

app.listen(5000);

```

Больше гибкости и наворотов,

по сравнению с `express-graphql`

-----

### [apollo-server@2.x.x](https://github.com/apollographql/apollo-server/tree/version-2)

```js
import { ApolloServer, gql } from 'apollo-server';

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => 'world',
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => prepareSomehowContextDataFromRequest(req),
  playground: true,
});
server.listen({
  port: 6000,
  endpoint: '/graphql',
  playground: '/playground',
});

```

<span class="fragment" data-code-focus="3-13">Стал ближе к `graphql-tools`</span>

<span class="fragment" data-code-focus="15-25">Можно сразу передавать `typeDefs` и `resolvers`</span>

-----

### apollo-server@2.x.x

- Subscriptions через PubSub
- поддержка загрузки файлов
- persisted queries
- всё ещё можно передать `schema`
- можно не ставить Express или Koa
- и еще удобнее сделали интеграцию со своими платными сервисами

При написании этой версии

всё что можно "повзаимвствовали" у `graphql-yoga` 😊

-----

### [graphql-yoga](https://github.com/prisma/graphql-yoga)

```js
import { GraphQLServer } from 'graphql-yoga'

const typeDefs = ...;
const resolvers = ...;

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: (req) => prepareSomehowContextDataFromRequest(req),
});
server.start({
  port: 7000,
  endpoint: '/graphql',
  playground: '/playground',
})

```

Шайба в шайбу с `apollo-server@2.x.x` ☺️

-----

### Важно про context

Задача сервера сформировать `context` для того, чтобы можно было разделить пользователей друг от друга при выполнении GraphQL-запросов.

```js
const server = new ApolloServer({ schema,
  context: ({ req }) => prepareSomehowContextDataFromRequest(req),
});

```

`context` это объект с данными текущего пользователя и глобальными ресурсами, которые будут доступны в резолверах вашей GraphQL-схемы

-----

Подробнее о серверах, [читать тут](https://github.com/nodkz/conf-talks/tree/master/articles/graphql/server)