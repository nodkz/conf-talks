## Важно ☝️ <!-- .element: class="green" -->

1. удобно и безошибочно формировать GraphQL-запросы <!-- .element: class="gray" -->
2. хитро слать запросы на сервер <!-- .element: class="green" -->
3. эффективно кешировать ответы и работать с данными <!-- .element: class="gray" -->

-----

## 2. Хитро слать запросы на сервер <!-- .element: class="green" -->

Это когда у вас есть некий умный `fetch` с мидлварами

-----

## Который берёт на себя все проблемы по <span class="orange">хитрой отправке GraphQL-запросов</span> на сервер.

-----

## Таким фетчем в ApolloClient является <br/>[apollo-link](https://www.apollographql.com/docs/link/)

<span class="gray">мы его минут 10 назад смотрели</span>

<span class="gray">он работает как на сервере, так и на клиенте</span>

-----

```js
const httpLink = new HttpLink({
  fetch,
  uri: 'https://graphql-compose.herokuapp.com/northwind/',
  credentials: 'same-origin',
  headers: {},
});

const retry = new RetryLink({
  delay: { initial: 300, max: Infinity, jitter: true },
  attempts: { max: 5, retryIf: (error, _operation) => !!error }
});

const link = ApolloLink.from([httpLink, retry]);
export const apolloClient = new ApolloClient({ cache, link });

```

<span class="fragment" data-code-focus="1-6" />
<span class="fragment" data-code-focus="8-11" />
<span class="fragment" data-code-focus="13" />
<span class="fragment" data-code-focus="14" />

-----

### Доступные мидлвары:

- apollo-link-<span class="green">http</span>
- apollo-link-<span class="green">ws</span>
- apollo-link-<span class="green">schema</span>
- apollo-link-<span class="orange">error</span>
- apollo-link-<span class="orange">context</span>
- apollo-link-<span class="orange">retry</span>
- apollo-link-<span class="orange">batch-http</span>
- apollo-link-<span class="orange">dedup</span>
- apollo-link-<span class="gray">state</span>
- apollo-link-<span class="gray">rest</span>

-----

## В Relay такой фетчер <br/>[react-relay-network-modern](https://github.com/relay-tools/react-relay-network-modern)

-----

## В разных проектах <br/><span class="red">свои тараканы с требованиями,</span> <br/>поэтому надо фетчить по-разному

-----

## Fetch с мидлварами позволяет <br/><span class="orange">быстро настроить</span> под себя всякую <span class="orange">хитрую логику</span> получения данных
