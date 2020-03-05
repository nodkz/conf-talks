# ApolloClient 3 <!-- .element: class="grey" -->

# Конфигурация <br/>кэша/стора

-----

## Она Декларативная! 😲

-----

## Сделали очень просто и удобно. <!-- .element: class="green" -->

Бабахнет так, как в своё время graphql-tools со своим простецким объявлением схем. <!-- .element: class="fragment" -->

-----

## `possibleTypes` – предоставляет информацию об Interfaces и Unions типах

<span class="fragment gray">До сих пор до конца не понимаю, нафига козе баян <br/> <a href="https://github.com/apollographql/apollo-client/issues/5750#issuecomment-595360603">https://github.com/apollographql/apollo-client/issues/5750#issuecomment-595360603</a></span>

-----

ApolloClient 2 – `fragmentMatcher`

```js
import introspectionQueryResultData from './fragmentTypes.json';

const cache = new InMemoryCache({
  fragmentMatcher: new IntrospectionFragmentMatcher({
    introspectionQueryResultData,
  }),
});

```

ApolloClient 3 – `possibleTypes`

```js
const cache = new InMemoryCache({
  possibleTypes: {
    Character: ["Jedi", "Droid"],
    Test: ["PassingTest", "FailingTest", "SkippedTest"],
  },
});

```

-----

## `typePolicies.keyFields` – какие поля использовать в качестве id <br/>

### (работает даже с алиасами полей) <!-- .element: class="gray" -->

-----

ApolloClient 2 – `dataIdFromObject`

```js
import { InMemoryCache, defaultDataIdFromObject } from 'apollo-cache-inmemory';

const cache = new InMemoryCache({
  dataIdFromObject(object) {
    switch (object.__typename) {
      case 'Product': return `Product:${object.upc}`;
      case 'Person': return `Person:${object.name}:${object.email}`;
      default: return defaultDataIdFromObject(object);
    }
  },
});

```

-----

ApolloClient 3 – `typePolicies.*.keyFields`

```js
import { InMemoryCache } from '@apollo/client';

const cache = new InMemoryCache({
  typePolicies: {
    Product: {
      keyFields: ["upc"],
    },
    Person: {
      keyFields: ["name", "email"],
    },
    Book: {
      keyFields: ["title", "author", ["name"]], // <-- nested-key author.name
    },
  },
});

```

-----

## `typePolicies.keyFields: false` – отключает нормализацию типа

Данные будут храниться в родительском объекте. <!-- .element: class="fragment green" -->

-----

## `Field policies` – позволяют декларативно описать дополнительную логику полей в конкретном типе

-----

## Если у поля есть аргументы <br />то кэш, хранит множество значений.

Пример такого ключа в кэше – `feed({"limit":10,"offset":0,"type":"news"})`

-----

## `keyArgs: []` – позволяет выбрать аргументы, которые используются в качестве ключа кэша для поля с аргументами

-----

ApolloClient 2 – во всех запросах пишем директиву `@connection` 💩

```graphql
query Feed($type: FeedType!, $offset: Int, $limit: Int) {
  feed(type: $type, offset: $offset, limit: $limit) @connection(
    key: "feed",
    filter: ["type"]
  ) {
    ...FeedEntry
  }
}

```

-----

ApolloClient 3 – один раз объявляем настройки в кэше 👍

```js
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        feed: {
          keyArgs: ["type"],
        },
      },
    },
  },
});

```

Если по-умолчанию генерируется такой ключ<br/>
`feed({"limit":10,"offset":0,"type":"news"})`

то с настройкой будет <br/>
`feed({"type":"news"})`

-----

#### И можно задать кастомную логику чтения и записи данных

```js
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        feed: {
          keyArgs: ["type"],
          // A custom read function from cache
          read(feedData, { args }) {
            return feedData.slice(args.offset, args.offset + args.limit);
          },
          // A custom merge function how to write to cache
          merge(existingData, incomingData, { args }) {
            return mergeFeedData(existingData, incomingData, args);
          },
        },
      },
    },
  },
});

```

-----

#### В итоге, многое вынесли в правильное место 👍

```js
const cache = new InMemoryCache({
  possibleTypes: {
    Test: ["PassingTest", "FailingTest", "SkippedTest"],
  },
  typePolicies: {
    Product: {
      keyFields: ["upc"],
    },
    Query: {
      fields: {
        feed: {
          keyArgs: ["type"],
          read(feedData, { args }) { ... },
          merge(existingData, incomingData, { args }) { ... },
        },
      },
    },
  },
});

```
