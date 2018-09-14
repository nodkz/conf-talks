# GraphQL Types

Перед тем как строить GraphQL схему, хорошо бы разобраться из каких элментов ее можно собрать. В GraphQL существует две группы типов:

- `Output-типы` - для описания ответа от сервера.
- `Input-типы` - для описания входящих параметров от клиента.

Некоторые из типов могут относиться как к `Output`, так и `Input`-типам. Подробнее с каждой разновидностью типа можно ознакомиться в следующих разделах:

- [Scalar types](#scalar-types) (Output, Input)
- [Custom scalar types](#custom-scalar-types)  (Output, Input)
- [Object types](#object-types)  (только Output)
- [Input types](#input-types)  (только Input)
- [Enumeration types](#enumeration-types) (Output, Input)
- [Lists and Non-Null](#lists-and-non-null) (модификаторы типов для Output, Input)
- [Interfaces](#interfaces) (только Output)
- [Union types](#union-types) (только Output)
- [Root types](#root-types) (только Output)

## Scalar types

Начнем с того, что в GraphQL существует 5 скалярных типов из коробки:

- `GraphQLInt` - целое число (32-бита)
- `GraphQLFloat` - число с плавающей точкой (64-бита)
- `GraphQLString` - строка d формате UTF-8
- `GraphQLBoolean` - true/false
- `GraphQLID` - строка, которая является уникальным индетификатором для какого-либо типа

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

Самый часто используемый конструктор типов в GraphQL - это `GraphQLObjectType`. С его помощью описывается объкты которые вы можете запросить с вашего сервера. 

## Input types

GraphQL для входящих полей/аргументов может использовать следующие типы:

- `GraphQLScalarType` - как встроенные `Int`, `String`, так и ваши кастомные скалярные типы
- `GraphQLEnumType` - это особый вид скаляров, о котором речь пойдет в другом разделе
- `GraphQLInputObjectType` - это сложные объекты, которые состоят из набора разных полей
- а также любой микс из уже озвученных типов с модификаторами `GraphQLList` и `GraphQLNonNull`

Важно знать, что `GraphQLObjectType` в качестве типа для входящей переменной использовать нельзя. Он просто слишком сложный, у него есть `args` (аргументы - которые непонятно как передавать и использовать), для полей есть `resolve` метод (задача которого готовить данные для вывода в ответе, а не ввода данных из запроса), есть `interfaces` от которых тоже нет особой практической пользы. Тем более для входных параметров надо иметь возможность задать значения по умолчанию `defaultValue`, которых нет в `GraphQLObjectType`. Да и в практике сложные объекты на ввод и вывод будут у вас отличаться. Например, чтобы отобразить данные по пользователю вам необходимо 3 поля (id, login, createdAt), а для создания всего 2 поля (login, password); т.к. поля id и createdAt генерятся на сервере, а отдача password через АПИ вообще черевата увольнением.

Чтобы не городить общий монстрообразный `ObjectType`, и сразу откреститься от банальных ошибок проектирования - в GraphQL для сложных входящих объектов заведен отдельный конструктор типов `GraphQLInputObjectType`.

Объявляется `GraphQLInputObjectType` очень просто. Задаете уникальное имя в рамках вашей GraphQL-схемы и перечисляете набор полей с их типами:

```js
const ArticleInput = new GraphQLInputObjectType({
  // уникальное имя для типа
  name: 'ArticleInput',
  // текстовое описание для всего типа
  description: 'Article data for input',
  // объявляем поля, рекомендую не лениться и сразу объявлять через () => ({})
  // это позволяет в будущем избежать проблемы с hoisting'ом,
  // когда у вас два типа импортят друг-друга
  fields: () => ({
    // объявлеяем поле `title`
    title: {
      // тип поля String!
      type: new GraphQLNonNull(GraphQLString),
      // значение по-умолчанию `Draft`
      defaultValue: 'Draft',
      // текстовое описание для документации АПИ:
      description: 'Article description, by default will be "Draft"', 
    },
    // объявлеяем поле `text`
    text: {
      // поле `type` является обязательным
      type: new GraphQLNonNull(GraphQLString),
      // все остальные поля опциональны, можно не указывать
    },
  }),
});
```

Хотелось бы дополнительно отметить, что `типы для полей внутри типа` (простым языком: типы для `title` и `text` внутри `ArticleInput`) могут быть Скаляром (Int, String, и т.п.), Enum'ом или другим `GraphQLInputObjectType` (если хотите вложенность). При этом их можно обернуть модификаторами массива (`GraphQLList`) и обязательного поля (`GraphQLNonNull`).

Ваши `GraphQLInputObjectType` могут использоваться только в качестве типа для аргументов в `GraphQLObjectType`:

```js
new GraphQLObjectType({
  name: 'Query',
  fields: {
    snippet: {
      args: {
        article: { type: ArticleInput }, // <-- вот он наш Input-тип (Output-тип сюда нельзя)
      },
      type: GraphQLString, // <-- а тут только Output-типы
    },
  },
}),
```

## Enumeration types

Также называемые Enums, это особый вид скаляра, который ограничен определенным набором допустимых значений (`key`-`value`). Это тип позволяет:

- Для клиентской стороны подтвердить, что поле этого типа содержит одно значение из допустимых `key`
- Для серверной стороны получить одно из допустимых `value`

Данный вид полей обычно применяется для указания возможной сортировки списков (ID_ASC, ID_DESC), для полей ограниченного набора, например пола (MALE, FEMALE) или статуса (ACTIVE, INACTIVE, PENDING). Это сделано для того, чтобы фронтендеры (и статический анализ) не гадали о допустимых значениях (`key`) на стороне клиента.

Объявить простой Enum можно так:

```js
const GenderEnum = new GraphQLEnumType({
  name: 'GenderEnum',
  values: {
    // key    value
    //  ↓       ↓
    MALE: { value: 1 },
    FEMALE: { value: 2 },
  },
});
```

Но в качестве `value` у Enum'а можно использовать объект. Вот например, объект для сортировки в MongoDB - клиент передает ключ `ID_ASC` и в `resolve` метод на сервере прилетает его значение `{ id: 1 }`:

```js
const SortByEnum = new GraphQLEnumType({
  name: 'SortByEnum',
  values: {
    // key            value
    //  ↓               ↓
    ID_ASC: { value: { id: 1 } }, // regular ascending index for MongoDB
    ID_DESC: { value: { id: -1 } },
    DAY_SCORE: { value: { day: -1, score: -1 } }, // compound index for MongoDB
  },
});
```

Таким образом клиенты могут делать следующие запросы. Обратите внимание, что клиенты со своей стороны работают только с `ключами` Enum'ов (они никак не может узнать что записано внутри `value`). Отдали `key` в аргументах/переменных, получили `key` в ответе.

```graphql
query {
  search(sort: ID_ASC) {
    wasSortedBy
    items
  }
}

# получим следующий ответ:
# search: {
#   wasSortedBy: 'ID_ASC',
#   items: ['MALE', 'MALE', 'FEMALE', 'MALE'],
# ]
```

Хочется обратить внимание на то, в каком виде Enum передается между сервером и клиентом:

- в запросе от клиента в `variables` (который является JSONом), `ID_ASC` передается в виде строки. Например: `variables: { "sort": "ID_ASC" }, query: 'query ($sort: SortByEnum){ search(sort: $sort) { wasSortedBy } }'`
- в запросе от клиента в самом теле GraphQL-запроса (который является GraphQL Query Language) передается без кавычек, как есть. Например: `query: 'query { search(sort: ID_ASC) { wasSortedBy } }'`
- в ответе от сервера (который является JSONом), Enum возвращает в виде строки. Например: `response: { "search": { "wasSortedBy": "ID_ASC" }}`

Прошу обратить внимание на важный ньюанс, когда вы используете объекты в качестве `value` для Enum. GraphQL использует строгое сравнение === для проверки `key` (для приема переменных от клиента) и `value` (для конвертации в ключ, чтоб вернуть клиенту). И если сравнение `ключей` от клиента никаких проблем не вызывает (`ID_ASC === ID_ASC` возвращает `true`). То вот возвращаемые `value` для Enum'ов в виде объектов на стороне сервера уже так просто переварены быть не могут (т.к. в JS `{ id: 1 } === { id: 1 }` возвращает `false`). Вам всегда надо использовать один и тот же объект, который указан в конфиге. Более детально эта проблема разобрана в [тестах](./__tests__/enumType-test.js).

Обычно народ не заморачивается с Enum'ами и всегда делает `key` и `value` одинаковыми, чтоб не иметь проблем с тем что передает и получает клиент, и тем что по факту прилетает в аргументах резолвера на сервере. Но вы то теперь знаете, как устроен Enum изнутри и можете его использовать на полную катушку.

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

## Root types

Особый вид типов, который используется для построения вашей GraphQL-схемы. Данных типов всего три и они строятся c помощью обычного `GraphQLObjectType`:

- `Query` - этот тип описывает все доступные операции ("точки входа") для чтения. Если запросили несколько полей, то они выполняются `параллельно`.
- `Mutation` - для операции записи. Если запросили несколько полей, то они выполняются `последовательно` (т.к. вызов предыдущего поля, может повлиять на результат изменения следующего поля).
- `Subscription` - подписки, особый вид операций позволяющий клиентам `подписаться на события` произошедшие на сервере. Например: клиент подписывается на добавление статьи, и как только будет добавлена статья, то сервер выполнит GraphQL-запрос и полученый ответ отправит клиенту. И это будет происходить для каждой новой статьи, пока клиент не отпишется. Грубо говоря, реальное выполнение GraphQL-запроса инициируется самим сервером на какое-то событие.

В `GraphQLSchema` обязательным параметром является только `Query`, без него схема просто не запустится. Инициализация схемы выглядит следующим образом:

```js
import { GraphQLSchema, GraphQLObjectType, graphql } from 'graphql';

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({ name: 'Query', fields: { userById, userMany } }),
  mutation: new GraphQLObjectType({ name: 'Mutation', fields: { createUser, removeLastUser } }),
  subscriptions: new GraphQLObjectType({ name: 'Subscription', fields: ... }),
  // ... и ряд других настроек
});

// как схема готова, на ней можно выполнять запросы
const response = await graphql(schema, `query { ... }`);
```

После объявления схемы, ей можно отправлять следующие запросы:

```graphql
query {
  userById { ... }
  userMany { ... }
  # `userById` и `userMany` будут запрошены параллельно
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

Особо хочется остановиться на состоянии запросов:

- `stateless` - должны быть `Query` и `Mutation`, т.е. если у вас в кластере много машин обслуживающих запросы клиентов, то неважно на какой из серверов прелител запрос. Его может выполнить любая нода.
- `statefull` - должен быть у `Subscription`, т.к. требуется установка постоянного подключения с клиентом, хранения данных о подписках, механизмом переподключения и восстановлением данных о существующих подписках. Пакет `graphql` никак не помогает в решении этих админских проблем.