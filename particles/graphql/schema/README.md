# GraphQL Schema

**GraphQL Schema – это описание ваших типов данных на сервере, связей между ними и логики получения этих самых данных.**

Еще раз по пунктам:

- у вас есть данные на сервере
- есть методы получения этих данных (`resolve-методы`)
- для этих методов вы описываете типы данных входящих и выходящих значений (`описание типов`)
- берете `resolve-методы` и `описание типов` хитро перемешиваете и получаете вашу `GraphQL Schema`.

Так как же данные? В каком формате и какой базе данных они будут храниться? В любой! Это неважно, когда у вас есть вами написанные `resolve-методы`, в которых вы напишете куда и как сходить за данными и обработать перед тем как отдать клиенту.

GraphQL задает конву, формат того как вы описываете доступ к своим данным. Это дело описывается через [GraphQL-спецификацию](http://facebook.github.io/graphql/draft/). Которую ребята из Фейсбука очень кропотливо прорабатывали и в 2017 опубликовали под [OWFa 1.0](http://www.openwebfoundation.org/legal/the-owf-1-0-agreements/owfa-1-0) соглашением (грубо говоря MIT-лицензией).

Так хорошо, а какой язык программирования мне нужно использовать? Любой! Спецификация уже реализовали на большинстве языков программирования.

Работает с любыми базами данных, на любом языке программирования - звучит хорошо!

## Описание схемы на сервере (build phase)

Чтобы запустить свой GraphQL-сервер, первым делом вам необходимо объявить схему `GraphQLSchema`. Схема содержит в себе описания всех типов, полей и методов получения данных. Все типы в рамках GraphQL-схемы должны иметь уникальные имена. Не должно быть двух разных типов с одним именем.

GraphQL-схема это точка входа, это корень всего вашего API. Правда у этого корня, три "головы":

- `query` - для операций получения данных
- `mutation` - для операций изменения данных
- `subscription` - для подписки на события

В `GraphQLSchema` обязательным параметром является только `query`, без него схема просто не запустится. Инициализация схемы выглядит следующим образом:

```js
import { GraphQLSchema, GraphQLObjectType, graphql } from 'graphql';

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({ name: 'Query', fields: { getUserById, findManyUsers } }),
  mutation: new GraphQLObjectType({ name: 'Mutation', fields: { createUser, removeLastUser } }),
  subscriptions: new GraphQLObjectType({ name: 'Subscription', fields: ... }),
  // ... и ряд других настроек
});
```

Особо хочется остановиться на состоянии операций, в GraphQL их два:

- `stateless` - все операции в `query` и `mutation` должны быть без состояния, т.е. если у вас в кластере много машин обслуживающих запросы клиентов, то неважно на какой из серверов прилетел запрос. Его может выполнить любая нода.
- `statefull` - должен быть у операций `subscription`, т.к. требуется установка постоянного подключения с клиентом, хранения данных о подписках, механизмом переподключения и восстановлением данных о существующих подписках. Пакет `graphql` никак не помогает в решении этих админских проблем.

Также важно рассмотреть различия в выполнении операции для `query` и `mutation`. Если все операции (поля) в `query` вызываются паралелльно, то в `mutation` они вызываются последовательно. Например:

```graphql
query {
  getUserById { ... }
  findManyUsers { ... }
  # `getUserById` и `findManyUsers` будут запрошены параллельно
}
```

```graphql
mutation {
  # сперва выполнится операция создания пользователя
  createUser { ... }
  # а после того как пользователь создан, выполнится операция на удаление
  removeLastUser { ... }
}
```

## Выполнение GraphQL-запросов (runtime phase)

Предположим у нас объявлена следующая схема:

```js
import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql';

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      hello: {
        type: GraphQLString,
        resolve: () => 'world',
      }
    }
  })
});

export default schema;
```

После инициализации `GraphQL-схемы` вы можете выполнять `GraphQL-запросы`. Делается это достаточно просто:

```js
import { graphql } from 'graphql';
import { schema } from './your-schema';

const query = '{ hello }';
const result = await graphql(schema, query); // returns: { data: { hello: "world" } }
```

Для выполнения запроса, необходимо вызвать метод `graphql()` из пакета `graphql`, который решает следующие задачи:

- производит парсинг GraphQL-запроса `query`
- производит валидацию полей в запросе на соответствие GraphQL-схемы `schema` (если запрошены несуществующие поля, или переданы неверные аргументы, то будет возвращена ошибка)
- выполняет запрос, пробегаясь по запрошенным Object-типам из `query`, вызывая их `resolve-методы`. Подробнее об Object-типе можно почитать в разделе о [Типах](../types/README.md#object-types).
- валидирует возвращаемый ответ (например, если для обязательного поля вы вернули `null`, то будет возвращена ошибка)

GraphQL по натуре строго типизированный, поэтому во всех запросах проверяются входящие переменные и аргументы, формат возвращаемого ответа на соответствие типов, которые объявлены в `GraphQL-схеме`. Если что-то некорректно запросили или вернули, то будет возвращена ошибка.

Пакет `graphql` ничего не знает о сети, правах доступа, не слушает никакой порт. Всё это дело реализуется на другом уровне абстракции - `GraphQL сервере`. В разделе [GraphQL-сервер](../server/README.md) вы найдете больше подробностей о том, что должен делать сервер, и какие популярные пакеты сейчас доступны в npm. Важно знать, что все сервера используют под капотом метод `graphql()` из пакета `graphql`.

## Описание схемы для клиента (интроспекция)

Когда у вас есть на сервере GraphQL-схема, то вы можете предоставить клиенту `описание типов`, без `resolve-методов`. Т.е. клиент будет знать что может вернуть сервер, но внутренняя реализация того, как это происходит будет от него скрыта. Описание типов GraphQL-схемы называется `интроспекцией` и выглядит следующим образом в формате SDL (Schema Definition Language):

```graphql
# The main root type of your Schema
type Query {
  book(id: Int): Book
  author(name: String): Author
}

# Author model
type Author {
  id: Int!
  name: String!
}

# Description for Book model
type Book {
  id: Int!
  name: String!
  authors: [Author]
}
```

Пример интроспекции побольше в формате [SDL на 130 типов](https://github.com/graphql-compose/graphql-compose-examples/blob/master/examples/northwind/data/schema.graphql) и она же в формате [JSON](https://github.com/graphql-compose/graphql-compose-examples/blob/master/examples/northwind/data/schema.graphql.json). А можно посмотреть интроспекцию всех [сервисов AWS Cloud](https://raw.githubusercontent.com/graphql-compose/graphql-compose-examples/master/examples/aws/data/schema.graphql) размером 1.8Mb, содержащию описание для более чем 10000 типов.

### Зачем нужна интроспекция клиенту?

Самому клиенту интроспекция может и не нужна, но вот для инструментария будет очень полезна:

- для IDE ([GraphiQL](https://github.com/graphql/graphiql/), [GraphQL Playground](https://github.com/prisma/graphql-playground), [Altair GraphQL Client](https://chrome.google.com/webstore/detail/altair-graphql-client/flnheeellpciglgpaodhkhmapeljopja)) в которой можно
  - удобно писать запросы с валидацией и автокомплитом
  - просматривать документацию
- для линтеров, которые проверяют корректность запросов в коде. Пишете в запросе несуществующее поле или аргумент, получаете ошибку. Например для JS и eslint, есть [eslint-plugin-graphql](https://github.com/apollographql/eslint-plugin-graphql)
- для тайпчекеров (Flowtype, TypeScript). Вы пишете graphql-запрос, а вам генерируются файлы с дифенишенами для ответов и входящих аргументов. Вы импортируете сгенерированные типы, аттачите к нужным переменным и получаете офигенную статическую проверку кода между клиентом и сервером. Стоит на сервере переименовать поле или изменить у него тип, то вы получите ошибку некоректного использования в конкретных файлах вашего клиента. Например: [apollo-cli](https://github.com/apollographql/apollo-cli) или [relay-compiler](https://facebook.github.io/relay/docs/en/graphql-in-relay.html#relay-compiler)
- для связывания микросервисной архитектуры. Если у вас несколько GraphQL-серверов, то их можно склеить в один большой GraphQL-сервер. Для примера, можно ознакомиться с подходом [Schema Stitching](https://www.apollographql.com/docs/graphql-tools/schema-stitching.html) от Apollo.

### Как сгенерировать интроспекцию?

Самый простой способ получить интроспекцию в формате JSON, это запросить ее у уже запущенного GraphQL-сервиса (если на сервере по причине безопасности её не запретили). Например `GraphiQL` и `GraphQL Playground` запрашивают её по http отправляя следующий [GraphQL-запрос](https://github.com/graphql/graphql-js/blob/3789a877c9ca6757c2c69ec965ea7dfb87f741eb/src/utilities/introspectionQuery.js#L21-L111).

В JS сгенерировать файл с интроспекцией схемы можно с помощью следующих скриптов:

#### Генерация интроспекции в формате SDL

```js
import fs from 'fs';
import { printSchema } from 'graphql';
import schema from './your-schema';

fs.writeFileSync('./schema.graphql', printSchema(schema));
```

#### Генерация интроспекции в формате JSON

```js
import fs from 'fs';
import { getIntrospectionQuery } from 'graphql';
import schema from './your-schema';

async function prepareJsonFile() {
  const result = await graphql(schema, getIntrospectionQuery());
  fs.writeFileSync('./schema.json', JSON.stringify(result, null, 2));
}

prepareJsonFile();
```

#### Автоматизируй генерацию схем

- [graphql-cli](https://github.com/graphql-cli/graphql-cli) - настраиваете файл `.graphqlconfig` и запускаете в терминале `graphql get-schema --watch`
- [webpack-plugin-graphql-schema-hot](https://github.com/nodkz/webpack-plugin-graphql-schema-hot) - плагин для Webpack которому передается путь до файла схемы `schemaPath`, а он уже под капотом следит за этим файлом и всеми его зависимостями. И в случае изменений автоматически генерирует `json` и `graphql` файлы. Этот плагин полезен для изоморфных приложений, или как минимум тем, у кого серверные скрипты собираются через Webpack.
- [get-graphql-schema](https://github.com/prisma/get-graphql-schema) - запускаете в терминале `get-graphql-schema ENDPOINT_URL > schema.graphql` и на выходе получаете схему
- Есть что добавить? Откройте Pull Request!