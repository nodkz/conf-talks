# Что такое SDL и интроспекция?

-----

## SDL — Schema Definition Language

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
<span class="fragment" data-code-focus="77-81" />

-----

## Интроспекция — это описание всех типов в вашей GraphQL-схеме.

<br/>Это ваша схема без resolve-методов.

Можно сравнить с `МЕНЮ в ресторане`

Видно что можно заказать, но не видно как и из чего готовится.

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

## Зачем нужна интроспекция клиенту?

- для IDE (GraphiQL, GraphQL Playground, Altair GraphQL Client)
- для линтеров, проверяющих корректность запросов в коде
- для тайпчекеров (Flowtype, TypeScript)
- для связывания микросервисной архитектуры

<br />
<br />

*Для тупого выполнения запросов интроспекция не нужна.*

-----

### Генерация интроспекции в формате SDL

```js
import fs from 'fs';
import { printSchema } from 'graphql';
import schema from './your-schema';

fs.writeFileSync('./schema.graphql', printSchema(schema));

```

-----

### Генерация интроспекции в формате JSON

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
