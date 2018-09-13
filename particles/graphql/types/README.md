# GraphQL Types

Перед тем как строить GraphQL схему, хорошо бы разобраться из каких элментов ее можно собрать. Такими строительными элементами являются следующие типы:

- [Scalar types](#scalar-types)
- [Custom scalar types](#custom-scalar-types)
- [Object types](#object-types)
- [Input types](#input-types)
- [Enumeration types](#enumeration-types)
- [Lists and Non-Null](#lists-and-non-null)
- [Interfaces](#interfaces)
- [Union types](#union-types)

## Scalar types

Начнем с того, что в GraphQL существует 5 скалярных типов из коробки:

- `Int` - целое число (32-бита)
- `Float` - число с плавающей точкой (64-бита)
- `String` - строка d формате UTF-8
- `Boolean` - true/false
- `ID` - строка, которая является уникальным индетификатором для какого-либо типа

Негусто. Но дальше вы сможете узнать как определить свои недостающие скалярные типы.

## Custom scalar types

В GraphQL есть возможность дополнительно определить свои кастомные скалярные типы. Такие как `Date`, `Email`, `URL`, `LimitedString`, `Password`, `SmallInt` и т.п. Пример реализации таких готовых типов можно найти в гитхабе:

- <https://github.com/stylesuxx/graphql-custom-types>
- <https://github.com/rse/graphql-tools-types>

Давайте рассмотрим как объявить новый скалярный тип для GraphQL в Nodejs. Делается это довольно просто:

```js
import { GraphQLScalarType, GraphQLError } from 'graphql';

export default new GraphQLScalarType({
  // 1) --- ОПРЕДЕЛЯЕМ МЕТАДАННЫЕ ТИПА ---
  // У каждого типа, должно быть уникальное имя
  name: 'DateTimestamp',
  // Хорошим тоном будет предоставить описание для вашего типа, чтобы оно отображалось в документации
  description: 'A string which represents a HTTP URL',
  
  // 2) --- ОПРЕДЕЛЯЕМ КАК ТИП ОТДАВАТЬ КЛИЕНТУ ---
  // Чтобы передать клиенту в GraphQL-ответе значение вашего поля
  // вам необходимо определить функцию `serialize`,
  // которая превратит значение в допустимый json-тип
  serialize: (v: Date) => v.getTime(), // return 1536417553

  // 3) --- ОПРЕДЕЛЯЕМ КАК ТИП ПРИНИМАТЬ ОТ КЛИЕНТА ---
  // Чтобы принять значение от клиента, провалидировать его и преобразовать
  // в нужный тип/объект для работы на сервере вам нужно определить две функции:

  // 3.1) первая это `parseValue`, используется если клиент передал значение через GraphQL-переменную:
  // {
  //   variableValues: { "date": 1536417553 }
  //   source: `query ($date: DateTimestamp) { setDate(date: $date) }`
  // }
  parseValue: (v: integer) => new Date(v),

  // 3.2) вторая это `parseLiteral`, используется если клиент передал значение в теле GraphQL-запроса:
  // {
  //   source: `query { setDate(date: 1536417553) }`
  // }
  parseLiteral: (ast) => {
    if (ast.kind === Kind.STRING) {
      throw new GraphQLError('Field error: value must be Integer');
    } else if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10)); // ast value is always in string format
    }
    return null;
  },
});
```

Чтобы детальнее разобраться в работе методов `serialize`, `parseValue` и `parseLiteral` вы можете скопировать [следующий файл с тестами](./__tests__/customScalarType-test.js) и уже погонять на нем свои сценарии.

В качестве интересного примера, вы можете посмотреть на реализацию MIXED типа - [GraphQLJSON](https://github.com/taion/graphql-type-json). Он принимает любое значение и также его возвращает, будь то число, строка, массив или сложный объект. Прекрасный лайфхак для передачи или получения значений с неизвестным заранее типом.

Таким образом GraphQL позволяет определить свои кастомные скалярные типы, который будут знать:

- как полученное от клиента значение провалидировать и преобразовать для дальнейшей работы на стороне сервера,
- так и превратить его обратно в допустимый json-тип для передачи в GraphQL-ответе,
- а самая главная вещь, что любые аргументы полученные в `resolve` методе будут содержать провалидированные значения и писать повторные проверки уже нет необходимости.

Скалярные типы можно использовоть как входящие значения для аргументов (от клиентов), так и как исходящие значения для полей ответа (от сервера).

## Object types

## Input types

## Enumeration types

Также называемые Enums, это особый вид скаляра, который ограничен определенным набором допустимых значений. Это тип позволяет:

- Подтвердить, что любые аргументы этого типа являются одним из допустимых значений (для входящих данных)
- Либо поле в ответе всегда будет одним из конечного набора значений (для выходящих данных)

Данный вид полей применяется для указания возможной сортировки списков (ID_ASC, ID_DESC), для полей ограниченого набора, например пола (MALE, FEMALE) или статуса (ACTIVE, INACTIVE, PENDING).

> TODO: написать тест, и показать name-value преобразование

## Lists and Non-Null

Когда вы объявляете поля в GraphQL схеме, то вы можете применить дополнительные модификаторы к типам:

- `GraphQLList` - задает массив указанного типа, например массив чисел `new GraphQLList(GraphQLInt)`
- `GraphQLNonNull` - указывает на то, что возвращаемое или получаемое значение не может быть пустым (иметь тип `null` или `undefined`). Например: `new GraphQLNonNull(GraphQLInt)`. Таким способом вы помечаете поле как обязательное.

При этом вы можете комбинировать модификаторы:

- `new GraphQLList(new GraphQLNonNull(GraphQLInt))` - может быть `null` или массив чисел.
- `new GraphQLNonNull(new GraphQLList(GraphQLInt))` - однозначно массив, у которого значения могут быть числом или `null`. При этом пустой массив (0 элементов), является валидным значением.
- `new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLInt)))` - однозначно массив с числами. Пустой массив будет валидным значением, а вот `[null]` - уже невалидным.

Эти модификаторы применяются как к Output-типам, так и к Input-типам. Если с сервера вы попытаетесь отдать некорректный тип, то получите ошибку. Тоже самое работает и с получением аргументов от клиента, если, например не указано обязательное поле, то запрос не будет выполнен и клиент получит ошибку.

## Interfaces

В GraphQL есть интерфейсы. Интерфейс - это абстрактный тип который содержит определенный набор полей и все типы которые реализуют его обязаны иметь эти поля.

Давайте смоделируем ситуацию. Преставим, что мы храним в базе разного рода события - `Событие_Клик` и `Событие_Регистрация`. У всех событий есть общие поля - это `ip` и `createdAt`. При этом у каждого конкретного типа есть свои уникальные атрибуты; для клика это `url`, а для регистрации это `login`.

GraphQL позволяет нам объявить Интерфейс-тип с общими полями:

```js
import { GraphQLInterfaceType } from 'graphql';

const EventInterface = new GraphQLInterfaceType({
  name: 'EventInterface',
  fields: () => ({
    ip: { type: GraphQLString },
    createdAt: { type: GraphQLInt },
  }),
  resolveType: value => {
    if (value instanceof ClickEvent) {
      return 'ClickEvent';
    } else if (value instanceof SignedUpEvent) {
      return 'SignedUpEvent';
    }
    return null;
  },
});
```

А конкретные Output-типы, которые реализуют интерфейс выше, объявляется следующим образом:

```js
const ClickEventType = new GraphQLObjectType({
  name: 'ClickEvent',
  interfaces: [EventInterface], // <------ Тип может быть описан несколькими интерфейсами
  fields: () => ({
    ip: { type: GraphQLString },
    createdAt: { type: GraphQLInt },
    url: { type: GraphQLString },
  }),
});

const SignedUpEventType = new GraphQLObjectType({
  name: 'SignedUpEvent',
  interfaces: [EventInterface],
  fields: () => ({
    ip: { type: GraphQLString },
    createdAt: { type: GraphQLInt },
    login: { type: GraphQLString },
  }),
});
```

Теперь представим, что у нас в схеме есть `search` метод, который возвращает массив `EventInterface`. С помощью следующего запроса мы можем запросить список событий по общим полям:

```graphql
query {
  search {
    __typename # <----- магическое поле, которое вернет имя типа для каждой записи
    ip
    createdAt
  }
}

# получим следующий ответ:
# search: [
#   { __typename: 'ClickEvent', createdAt: 1536854101, ip: '1.1.1.1' },
#   { __typename: 'ClickEvent', createdAt: 1536854102, ip: '1.1.1.1' },
#   { __typename: 'SignedUpEvent', createdAt: 1536854103, ip: '1.1.1.1' },
# ]
```

При этом GraphQL позволяет дозапросить поля для конкретных типов следующим нехитрым способом:

```graphql
query {
  search {
    __typename
    ip
    createdAt
    ...on ClickEvent {
      url
    }
    ...on SignedUpEvent {
      login
    }
  }
}

# получим следующий ответ:
# search: [
#   { __typename: 'ClickEvent', createdAt: 1536854101, ip: '1.1.1.1', url: '/list' },
#   { __typename: 'ClickEvent', createdAt: 1536854102, ip: '1.1.1.1', url: '/register' },
#   { __typename: 'SignedUpEvent', createdAt: 1536854103, ip: '1.1.1.1', login: 'NICKNAME' },
# ]
```

Таким образом, вы можете объявить, что поле возвращает `InterfaceType` и тут же запрашивать общие поля доступные в интерфейе. А если указать конкретные тип, то дозапросить дополнительные поля для записи, которые имеют соотвествующий тип.

Рабочий пример можно посмотреть в [тестах](./__tests__/interfaceType-test.js).

К сожалению, по состоянию на конец 2018 года GraphQL не поддерживает интерфейсы для Input-типов. Вы можете использовать интерфейсы только для Output-типов.

## Union types

Когда вам необходимо описать поле, которое может возвращать разного типа значения, то вы можете воспользоваться Union-типом. Для юнион типа, вы можете использовать только сложные типы построенные с помощью GraphQLObjectType. Скалярные типы, инпут типы, интерфейсы использовать нельзя.

Например, ваш поиск может вернуть три разных объекта - Статью, Комментарий и Профайл пользователя. Объявить такой Union-тип можно следующим образом:

```js
import { GraphQLUnionType } from 'graphql';

const SearchRowType = new GraphQLUnionType({
  name: 'SearchRow',
  description: 'Search item which can be one of the following types: Article, Comment, UserProfile',
  types: () => ([ ArticleType, CommentType, UserProfileType ]),
  resolveType: (value) => {
    if (value instanceof Article) {
      return ArticleType;
    } else if (value instanceof Comment) {
      return CommentType;
    } else if (value instanceof UserProfile) {
      return UserProfileType;
    }
  },
});
```

И если наш `search` метод будет возвращать массив элементов `SearchRowType`, то GraphQL-запрос можно будет строить следующим образом:

```graphql
query {
  search(q: "text") {
    __typename # <----- магическое поле, которое вернет имя типа для каждой записи
    ...on Article {
      title
      publishDate
    }
    ...on Comment {
      text
      author
    }
    ...on UserProfile {
      nickname
      age
    }
  }
}

# получим следующий ответ:
# search: [
#   { __typename: 'Article', publishDate: '2018-09-10', title: 'Article 1' },
#   { __typename: 'Comment', author: 'Author 1', text: 'Comment 1' },
#   { __typename: 'UserProfile', age: 20, nickname: 'Nick 1' },
# ]
```

Т.е. у вас будет возможность для каждого конкретного типа запросить свои поля. Рабочий пример можно посмотреть в [тестах](./__tests__/unionType-test.js).

Отличие `InterfaceType` и `UnionType` в том, что у интерфейса есть общие поля, a union может содержать абсолютно разнородные Output-типы.