# Что такое GraphQL?

-----

### REST API, Swagger – давай до свидания! <!-- .element: class="orange" -->

### – сказали в Facebook'е, сильно намучавшись в своих Data Driven Apps <!-- .element: class="fragment" -->

-----

## GraphQL — это не база данных! <!-- .element: class="red" -->

-----

#### Unofficial description <!-- .element: class="gray" -->

### GraphQL – это набор функций со статически типизированными аргументами и результатом. <!-- .element: class="orange" -->

### Где на полученном результате, можно сразу вызвать вложенные функции.

-----

#### Official description  <!-- .element: class="gray" -->

## GraphQL – это <br/>язык запросов к вашему API <!-- .element: class="green" -->

-----

# Язык? <!-- .element: class="orange" -->

-----

### На самом деле в GraphQL два языка

- язык запросов (query language) <!-- .element: class="fragment" -->
- schema definition language (SDL) <!-- .element: class="fragment" -->

-----

## Первый язык – Язык запросов <!-- .element: class="green" -->

[![GraphQL Query](./graphql-query.png) <!-- .element: class="plain" -->](https://graphql-compose.herokuapp.com/northwind/?query=%7B%0A%20%20viewer%20%7B%0A%20%20%20%20%23%20%D0%93%D0%B8%D0%B1%D0%BA%D0%BE%D1%81%D1%82%D1%8C%20%D0%B0%D0%B3%D1%80%D1%83%D0%BC%D0%B5%D0%BD%D0%B5%D0%BD%D1%82%D0%BE%D0%B2%0A%20%20%20%20customer%28filter%3A%20%7BcustomerID%3A%20%22AROUT%22%7D%29%20%7B%0A%20%20%20%20%20%20%23%20%D0%92%D1%8B%D0%B1%D0%BE%D1%80%20%D0%BF%D0%BE%D0%BB%D0%B5%D0%B9%20%D0%B2%20%D0%BE%D1%82%D0%B2%D0%B5%D1%82%D0%B5%0A%20%20%20%20%20%20customerID%0A%20%20%20%20%20%20companyName%0A%20%20%20%20%20%20%23%20%D0%92%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%BD%D1%8B%D0%B5%20%D0%B7%D0%B0%D0%BF%D1%80%D0%BE%D1%81%D1%8B%0A%20%20%20%20%20%20%23%20%D0%9E%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D0%B5%20%D1%81%D0%B2%D1%8F%D0%B7%D0%B5%D0%B9%20%D0%BC%D0%B5%D0%B6%D0%B4%D1%83%20%D1%80%D0%B5%D1%81%D1%83%D1%80%D1%81%D0%B0%D0%BC%D0%B8%2F%D0%BC%D0%BE%D0%B4%D0%B5%D0%BB%D1%8F%D0%BC%D0%B8%0A%20%20%20%20%20%20orderList%28limit%3A%203%2C%20skip%3A%2010%29%20%7B%0A%20%20%20%20%20%20%20%20%23%20%D0%A4%D1%80%D0%B0%D0%B3%D0%BC%D0%B5%D0%BD%D1%82%D1%8B%20%28%D0%B4%D0%BB%D1%8F%20%D0%BA%D0%BE%D0%BC%D0%BF%D0%BE%D0%BD%D0%B5%D0%BD%D1%82%D0%BD%D0%BE%D0%B3%D0%BE%20%D0%BF%D0%BE%D0%B4%D1%85%D0%BE%D0%B4%D0%B0%29%0A%20%20%20%20%20%20%20%20...OrderData%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%20%20%23%20%D0%97%D0%B0%D0%BF%D1%80%D0%BE%D1%81%D0%B8%D1%82%D1%8C%20%D0%BD%D0%B5%D1%81%D0%BA%D0%BE%D0%BB%D1%8C%D0%BA%D0%BE%20%D1%80%D0%B5%D1%81%D1%83%D1%80%D1%81%D0%BE%D0%B2%20%D0%B2%20%D0%BE%D0%B4%D0%BD%D0%BE%D0%BC%20%D0%B7%D0%B0%D0%BF%D1%80%D0%BE%D1%81%D0%B5%0A%20%20%20%20%23%20%D0%93%D0%B8%D0%B1%D0%BA%D0%BE%D1%81%D1%82%D1%8C%20%D0%B0%D0%B3%D1%80%D1%83%D0%BC%D0%B5%D0%BD%D0%B5%D0%BD%D1%82%D0%BE%D0%B2%0A%20%20%20%20order1%3A%20order%28filter%3A%20%7BorderID%3A%2011001%7D%29%20%7B%0A%20%20%20%20%20%20%23%20%D0%A4%D1%80%D0%B0%D0%B3%D0%BC%D0%B5%D0%BD%D1%82%D1%8B%20%28%D0%B4%D0%BB%D1%8F%20%D0%BA%D0%BE%D0%BC%D0%BF%D0%BE%D0%BD%D0%B5%D0%BD%D1%82%D0%BD%D0%BE%D0%B3%D0%BE%20%D0%BF%D0%BE%D0%B4%D1%85%D0%BE%D0%B4%D0%B0%29%0A%20%20%20%20%20%20...OrderData%0A%20%20%20%20%7D%0A%20%20%20%20%23%20%D0%97%D0%B0%D0%BF%D1%80%D0%BE%D1%81%D0%B8%D1%82%D1%8C%20%D0%BD%D0%B5%D1%81%D0%BA%D0%BE%D0%BB%D1%8C%D0%BA%D0%BE%20%D1%80%D0%B5%D1%81%D1%83%D1%80%D1%81%D0%BE%D0%B2%20%D0%B2%20%D0%BE%D0%B4%D0%BD%D0%BE%D0%BC%20%D0%B7%D0%B0%D0%BF%D1%80%D0%BE%D1%81%D0%B5%0A%20%20%20%20%23%20%D0%93%D0%B8%D0%B1%D0%BA%D0%BE%D1%81%D1%82%D1%8C%20%D0%B0%D0%B3%D1%80%D1%83%D0%BC%D0%B5%D0%BD%D0%B5%D0%BD%D1%82%D0%BE%D0%B2%0A%20%20%20%20order2%3A%20order%28filter%3A%20%7BorderID%3A%2011002%7D%29%20%7B%0A%20%20%20%20%20%20%23%20%D0%A4%D1%80%D0%B0%D0%B3%D0%BC%D0%B5%D0%BD%D1%82%D1%8B%20%28%D0%B4%D0%BB%D1%8F%20%D0%BA%D0%BE%D0%BC%D0%BF%D0%BE%D0%BD%D0%B5%D0%BD%D1%82%D0%BD%D0%BE%D0%B3%D0%BE%20%D0%BF%D0%BE%D0%B4%D1%85%D0%BE%D0%B4%D0%B0%29%0A%20%20%20%20%20%20...OrderData%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0A%0A%23%20%D0%A4%D1%80%D0%B0%D0%B3%D0%BC%D0%B5%D0%BD%D1%82%D1%8B%20%28%D0%B4%D0%BB%D1%8F%20%D0%BA%D0%BE%D0%BC%D0%BF%D0%BE%D0%BD%D0%B5%D0%BD%D1%82%D0%BD%D0%BE%D0%B3%D0%BE%20%D0%BF%D0%BE%D0%B4%D1%85%D0%BE%D0%B4%D0%B0%29%0Afragment%20OrderData%20on%20Order%20%7B%0A%20%20%23%20%D0%92%D1%8B%D0%B1%D0%BE%D1%80%20%D0%BF%D0%BE%D0%BB%D0%B5%D0%B9%20%D0%B2%20%D0%BE%D1%82%D0%B2%D0%B5%D1%82%D0%B5%0A%20%20orderID%0A%20%20orderDate%0A%20%20freight%0A%7D)

-----

<iframe src="https://graphql-compose.herokuapp.com/northwind/?query=%7B%0A%20%20viewer%20%7B%0A%20%20%20%20%23%20%D0%93%D0%B8%D0%B1%D0%BA%D0%BE%D1%81%D1%82%D1%8C%20%D0%B0%D0%B3%D1%80%D1%83%D0%BC%D0%B5%D0%BD%D0%B5%D0%BD%D1%82%D0%BE%D0%B2%0A%20%20%20%20customer%28filter%3A%20%7BcustomerID%3A%20%22AROUT%22%7D%29%20%7B%0A%20%20%20%20%20%20%23%20%D0%92%D1%8B%D0%B1%D0%BE%D1%80%20%D0%BF%D0%BE%D0%BB%D0%B5%D0%B9%20%D0%B2%20%D0%BE%D1%82%D0%B2%D0%B5%D1%82%D0%B5%0A%20%20%20%20%20%20customerID%0A%20%20%20%20%20%20companyName%0A%20%20%20%20%20%20%23%20%D0%92%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%BD%D1%8B%D0%B5%20%D0%B7%D0%B0%D0%BF%D1%80%D0%BE%D1%81%D1%8B%0A%20%20%20%20%20%20%23%20%D0%9E%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D0%B5%20%D1%81%D0%B2%D1%8F%D0%B7%D0%B5%D0%B9%20%D0%BC%D0%B5%D0%B6%D0%B4%D1%83%20%D1%80%D0%B5%D1%81%D1%83%D1%80%D1%81%D0%B0%D0%BC%D0%B8%2F%D0%BC%D0%BE%D0%B4%D0%B5%D0%BB%D1%8F%D0%BC%D0%B8%0A%20%20%20%20%20%20orderList%28limit%3A%203%2C%20skip%3A%2010%29%20%7B%0A%20%20%20%20%20%20%20%20%23%20%D0%A4%D1%80%D0%B0%D0%B3%D0%BC%D0%B5%D0%BD%D1%82%D1%8B%20%28%D0%B4%D0%BB%D1%8F%20%D0%BA%D0%BE%D0%BC%D0%BF%D0%BE%D0%BD%D0%B5%D0%BD%D1%82%D0%BD%D0%BE%D0%B3%D0%BE%20%D0%BF%D0%BE%D0%B4%D1%85%D0%BE%D0%B4%D0%B0%29%0A%20%20%20%20%20%20%20%20...OrderData%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%20%20%23%20%D0%97%D0%B0%D0%BF%D1%80%D0%BE%D1%81%D0%B8%D1%82%D1%8C%20%D0%BD%D0%B5%D1%81%D0%BA%D0%BE%D0%BB%D1%8C%D0%BA%D0%BE%20%D1%80%D0%B5%D1%81%D1%83%D1%80%D1%81%D0%BE%D0%B2%20%D0%B2%20%D0%BE%D0%B4%D0%BD%D0%BE%D0%BC%20%D0%B7%D0%B0%D0%BF%D1%80%D0%BE%D1%81%D0%B5%0A%20%20%20%20%23%20%D0%93%D0%B8%D0%B1%D0%BA%D0%BE%D1%81%D1%82%D1%8C%20%D0%B0%D0%B3%D1%80%D1%83%D0%BC%D0%B5%D0%BD%D0%B5%D0%BD%D1%82%D0%BE%D0%B2%0A%20%20%20%20order1%3A%20order%28filter%3A%20%7BorderID%3A%2011001%7D%29%20%7B%0A%20%20%20%20%20%20%23%20%D0%A4%D1%80%D0%B0%D0%B3%D0%BC%D0%B5%D0%BD%D1%82%D1%8B%20%28%D0%B4%D0%BB%D1%8F%20%D0%BA%D0%BE%D0%BC%D0%BF%D0%BE%D0%BD%D0%B5%D0%BD%D1%82%D0%BD%D0%BE%D0%B3%D0%BE%20%D0%BF%D0%BE%D0%B4%D1%85%D0%BE%D0%B4%D0%B0%29%0A%20%20%20%20%20%20...OrderData%0A%20%20%20%20%7D%0A%20%20%20%20%23%20%D0%97%D0%B0%D0%BF%D1%80%D0%BE%D1%81%D0%B8%D1%82%D1%8C%20%D0%BD%D0%B5%D1%81%D0%BA%D0%BE%D0%BB%D1%8C%D0%BA%D0%BE%20%D1%80%D0%B5%D1%81%D1%83%D1%80%D1%81%D0%BE%D0%B2%20%D0%B2%20%D0%BE%D0%B4%D0%BD%D0%BE%D0%BC%20%D0%B7%D0%B0%D0%BF%D1%80%D0%BE%D1%81%D0%B5%0A%20%20%20%20%23%20%D0%93%D0%B8%D0%B1%D0%BA%D0%BE%D1%81%D1%82%D1%8C%20%D0%B0%D0%B3%D1%80%D1%83%D0%BC%D0%B5%D0%BD%D0%B5%D0%BD%D1%82%D0%BE%D0%B2%0A%20%20%20%20order2%3A%20order%28filter%3A%20%7BorderID%3A%2011002%7D%29%20%7B%0A%20%20%20%20%20%20%23%20%D0%A4%D1%80%D0%B0%D0%B3%D0%BC%D0%B5%D0%BD%D1%82%D1%8B%20%28%D0%B4%D0%BB%D1%8F%20%D0%BA%D0%BE%D0%BC%D0%BF%D0%BE%D0%BD%D0%B5%D0%BD%D1%82%D0%BD%D0%BE%D0%B3%D0%BE%20%D0%BF%D0%BE%D0%B4%D1%85%D0%BE%D0%B4%D0%B0%29%0A%20%20%20%20%20%20...OrderData%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0A%0A%23%20%D0%A4%D1%80%D0%B0%D0%B3%D0%BC%D0%B5%D0%BD%D1%82%D1%8B%20%28%D0%B4%D0%BB%D1%8F%20%D0%BA%D0%BE%D0%BC%D0%BF%D0%BE%D0%BD%D0%B5%D0%BD%D1%82%D0%BD%D0%BE%D0%B3%D0%BE%20%D0%BF%D0%BE%D0%B4%D1%85%D0%BE%D0%B4%D0%B0%29%0Afragment%20OrderData%20on%20Order%20%7B%0A%20%20%23%20%D0%92%D1%8B%D0%B1%D0%BE%D1%80%20%D0%BF%D0%BE%D0%BB%D0%B5%D0%B9%20%D0%B2%20%D0%BE%D1%82%D0%B2%D0%B5%D1%82%D0%B5%0A%20%20orderID%0A%20%20orderDate%0A%20%20freight%0A%7D" width="100%" height="720px" />

-----

#### Второй язык

## SDL — Schema Definition Language <!-- .element: class="green" -->

Это простой формат описания GraphQL-схемы.

Он не зависит ни от какого языка программирования.

-----

## SDL

```graphql
# Output-тип
type Post {
  id: Int!
  title: String!
  publishedAt: DateTime!
  comments(limit: Int = 10): [Comment]
}

# Input-тип
input Credentials {
  login: String!
  password: String!
}

# Enum-тип
enum Direction {
  NORTH
  EAST
  SOUTH
  WEST
}

# Interface
interface NamedEntity {
  name: String
}

interface ValuedEntity {
  value: Int
}

type Business implements NamedEntity & ValuedEntity {
  name: String
  value: Int
  employeeCount: Int
}

# Unions
union SearchResult = Photo | Person

type Person {
  name: String
}

type Photo {
  height: Int
  width: Int
}

type SearchQuery {
  firstSearchResult: SearchResult
}

# Custom scalars
scalar Time
scalar Url

# Модификаторы типов
type SomeType {
  # Массив
  strings: [String]

  # Non-Null
  nonNullString: String!

  # Комбинация модификаторов
  nonNullStrings: [String!]!
}

# Директивы
directive @example on FIELD_DEFINITION | ARGUMENT_DEFINITION

type SomeType {
  field(arg: Int @example): String @example
}

# Root
schema {
  query: MyQueryRootType
  mutation: MyMutationRootType
  subscription: MySubscriptionRootType
}

```

<span class="fragment" data-code-focus="1-7" />
<span class="fragment" data-code-focus="9-13" />
<span class="fragment" data-code-focus="15-21" />
<span class="fragment" data-code-focus="23-36" />
<span class="fragment" data-code-focus="38-52" />
<span class="fragment" data-code-focus="54-56" />
<span class="fragment" data-code-focus="58-68" />
<span class="fragment" data-code-focus="70-75" />
<span class="fragment" data-code-focus="77-82" />

-----

## GraphQL-схема

-----

### GraphQL-схема содержит в себе <br/>описания всех типов, полей <br/>и `resolve`-функции получения данных.

-----

### У GraphQL-схемы 3 вида узлов: <!-- .element: class="orange" -->

- если скалярные типы описывают листья вашего графа,
- Оbject-типы описывают промежуточные узлы,
- то Root-типы описывают корневые узлы (корни).

-----

### Root-типов ("точек входа") всего три: <!-- .element: class="orange" -->

- `Query` —  для операций чтения (parallel)
- `Mutation` — для операции записи (serial)
- `Subscription` — подписки на серверные события (WS)

-----

### Вся система типов очень подробно и доходчиво

### [расписана у меня в гитхабе](https://github.com/nodkz/conf-talks/blob/master/articles/graphql/types/README.md)

-----

## Интроспекция

-----

## Интроспекция — это описание всех типов в вашей GraphQL-схеме. <!-- .element: class="green" -->

<br/>Это ваша схема без resolve-методов.

Можно сравнить с `МЕНЮ в ресторане`

Видно, что можно заказать, но не видно, как и из чего готовится.

-----

## Пример интроспекции в формате SDL

```graphql
type Query {
  book(id: Int): Book
  author(name: String): Author
}

# Author model
type Author {
  name: String!
}

type Book {
  id: Int!
  name: String!
  authors: [Author]
}

```

Вся ваша схема, только без `resolve`-методов.

-----

## Зачем нужна интроспекция клиенту? <!-- .element: class="orange" -->

- для IDE (GraphiQL, GraphQL Playground, Altair GraphQL Client)
- для линтеров (проверки корректности запросов)
- для тайпчекеров (TypeScript, Flowtype)
- для связывания микросервисной архитектуры (stitching, federation)

<br />
<br />

*Для тупого выполнения запросов интроспекция не нужна.* <!-- .element: class="green" -->

-----

### <span class="orange">Сервер через интроспекцию рассказывает о своих возможностях,</span> <br/><br/><span class="green">а клиент через GraphQL-запрос – о своих потребностях.</span>

### <br/>И все это дело со статической типизацией. <!-- .element: class="fragment red" -->
