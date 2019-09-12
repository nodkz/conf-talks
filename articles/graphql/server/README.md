# GraphQL сервер

## graphql - core package

[GraphQL спецификация](https://github.com/facebook/graphql) может быть реализована на любом языке программирования. Для NodeJS такой реализацией является пакет [graphql](https://github.com/graphql/graphql-js). Это самый главный пакет и с его помощью:

- объявляется GraphQL Schema (описание типов, связей между ними)
- производится парсинг и валидация GraphQL запросов
- выполняется GraphQL запрос и предоставляется ответ
- формируется интроспекция схемы в SDL (Schema Definition Language) или json

Этот пакет ничего не знает о сети, правах доступа, базах данных. Всё это дело реализуется на другом уровне абстракции.

Вот так схема создается:

```js
import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql';

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      hello: {
        type: GraphQLString,
        resolve: () => 'world',
      }
    }
  })
});
```

А вот так выполняется запрос:

```js
import { graphql } from 'graphql';

const query = '{ hello }';

// Быстрый легкий вариант
// const result = await graphql(schema, query);

// Вариант с наворотами
const result = await graphql({
  schema,
  source: query, // текст запроса
  contextValue: prepareSomehowContext(), // глобальный контекст для resolve-методов
  variableValues: {}, // переменные для GraphQL-запроса
});

expect(result).toEqual({ data: { hello: "world" } });
```

Зная как строится схема и выполняются запросы, уже можно писать тесты.
А вот чтобы поднять веб-сервер с GraphQL, нужно переходить на следующий уровень абстракции.

## Runtime сервер

Каковы обычно требования к серверу? По некому протоколу обслуживать множество запросов от разных клиентов. Это может быть http(s) или websockets, либо вообще что-то экзотическое типа ssh, telnet. Ведь использование GraphQL не ограничено каким-либо сетевым протоколом.

Cейчас давайте остановимся на http протоколе и посмотрим на такой GraphQL-сервер. В работе он должен будет произвести следующие операции:

- открыть порт и слушать http-запросы от клиентов
- инициализировать GraphQL-схему
- вытаскивать GraphQL-запрос с переменными из полученных http-запросов (либо пойти куда-то и взять персистентный GraphQL запрос, когда вам передан только Id запроса с переменными)
- формировать `context` с данными текущего пользователя и глобальными ресурсами, которые будут доступны в резолверах вашей GraphQL-схемы
- отправить на выполнение GraphQL-схему, запрос и контекст в пакет `graphql`
- из полученных данных или ошибки от `graphql` сформировать http-ответ и отправить клиенту
- по желанию попутно сделать всякие операции, типа парсинга кук, проверки токенов, логирования запросов, кеша запросов, отлова ошибок и отправки их в систему мониторинга.

Некислый набор операций, и на каждом пункте могут быть свои нюансы в реализации. Поэтому в NPM'ах можно найти много разных пакетов, предлагающих разные плюшки. Давайте остановимся на самых основных пакетах:

### express-graphql

[express-graphql](https://github.com/graphql/express-graphql) - самый первый в истории пакет в NPM'ах, на котором поднимается GraphQL-сервер. Это даже не сервер а middleware для сервера `Express`, `Connect` или `Restify`.

Если у вас уже есть Express приложение, то добавить uri по которому будет отвечать GraphQL не составит проблем:

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

У этого пакета есть одна проблема - захардкоженное ограничение размера запроса в [100kb](https://github.com/graphql/express-graphql/blob/41e26f803f4bf6888a4dedf9af99153892d13eb4/src/parseBody.js#L114). Обычно это не проблема, и элементарная защита от DDOS. Но блин, его нельзя переопределить в настройках.

### koa-graphql

[koa-graphql](https://github.com/chentsulin/koa-graphql) - такое же middleware как `express-graphql`, только для `Koa`.

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

### apollo-server 1.0

[apollo-server@1.x.x](https://github.com/apollographql/apollo-server/tree/version-1) - полная замена для `express-graphql` и `koa-graphql` с набор дополнительных конфигурационных опций. Позволяют делать трейсинг запросов и использовать Apollo Cache Control. Больше гибкости и наворотов по сравнению с `express-graphql`.

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

### apollo-server 2.0

[apollo-server@2.x.x](https://github.com/apollographql/apollo-server/tree/version-2) - уже применили совсем другой подход, позаимствованный у `graphql-yoga`. В этой версии они сделали два ключевых изменения:

- теперь для запуска GraphQL-сервера достаточно скачать этот пакет, указать порт и запустить сервер. Никаких `express` или `koa` устанавливать явно уже не нужно (они сами поднимут `express` под капотом). При этом интеграцию с ними они оставили, ежели у вас уже написан какой-то сервер.
- и теперь вместо передачи `GraphQLSchema` (хотя можно передать и её), проповедуют передачу `typeDefs` и `resolvers`. Такой формат построения схемы был предложен в [graphql-tools](https://github.com/apollographql/graphql-tools), широко распиарен и сейчас большинство пользователей строят схему именно так. Но я обычно генерирую свои GraphQL схемы из моделей через [graphql-compose](https://github.com/graphql-compose/graphql-compose), поэтому особо `graphql-tools` cо своим подходом у меня не прижился.

Ну и конечно добавили сразу поддержку Subscriptions через PubSub, поддержку загрузки файлов, persisted queries и еще удобнее сделали интеграцию со своими платными сервисами.

Сделали возможность передачи "расчлененной схемы" через `typeDefs` и `resolvers`:

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

Нормальную схему они тоже поддерживают - вместо "расчлененки" `typeDefs` и `resolvers`, нужно передать параметр `schema` как в примерах выше.

### graphql-yoga

[graphql-yoga](https://github.com/prisma/graphql-yoga) - это можно сказать прототип для `apollo-server 2.0`, авторы которой черпали вдохновление именно с этого пакета. Поэтому базовый функционал у них почти одинаковый.

Есть поддержка Subscriptions через PubSub, загрузки файлов.

```js
import { GraphQLServer } from 'graphql-yoga'

const typeDefs = `
  type Query {
    hello: String
  }
`

const resolvers = {
  Query: {
    hello: () => 'world',
  },
};

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

Вместо `typeDefs` и `resolvers` можно передать схему целиком через параметр `schema`.
