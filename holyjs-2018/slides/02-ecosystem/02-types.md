# GraphQL-типы

![Диаграмма экосистемы](./diagram-ecosystem-schema.svg) <!-- .element: style="width: 90vw;" class="plain"  -->

-----

### GraphQL-схема содержит в себе <br/>описания всех типов, полей <br/>и функции получения данных.

-----

## GraphQL-тип содержит в себе поля

## Поля содержат в себе GraphQL-тип

-----

#### Тип — Поля — Тип — Поля — Тип — Поля — ...

Думаете все так просто? 🤔 <!-- .element: class="fragment" -->

Конечно просто! <!-- .element: class="fragment" -->

Через месяц другой использования GraphQL <br /> 😈 <!-- .element: class="fragment" -->

### Погнали ускорять понимание! <!-- .element: class="fragment" -->

-----

## Есть две группы типов:

- Output — для вывода данных
- Input — для ввода данных

А еще модификаторы и аннотации 🤯 <!-- .element: class="fragment" -->

-----

### Система типов состоит из:

- Scalar types (Output, Input) <!-- .element: class="fragment" -->
- Custom scalar types (Output, Input) <!-- .element: class="fragment" -->
- Object types (только Output) <!-- .element: class="fragment" -->
- Input types (только Input) <!-- .element: class="fragment" -->
- Enumeration types (Output, Input) <!-- .element: class="fragment" -->
- Lists and Non-Null (модификаторы типов для Output, Input) <!-- .element: class="fragment" -->
- Interfaces (только Output) <!-- .element: class="fragment" -->
- Union types (только Output) <!-- .element: class="fragment" -->
- Root types (только Output) <!-- .element: class="fragment" -->
- Directives (аннотации для типов и рантайма) <!-- .element: class="fragment" -->

-----

## Scalar types

## 5 базовых скалярных типов

- `GraphQLInt` — целое число
- `GraphQLFloat` — число с плавающей точкой
- `GraphQLString` — строка в формате UTF-8
- `GraphQLBoolean` — true/false
- `GraphQLID` — строка; уникальный идентификатор

-----

## Custom scalar types

Не хватает 5 скалярных типов?

Хочется сразу работать с Date, а не циферками?

Date, Email, URL, LimitedString, Password, SmallInt ...

<br/>

Их можно объявить самостоятельно! <!-- .element: class="fragment" -->

-----

#### Объявляем свой Custom scalar type

<pre><code>import { GraphQLScalarType, GraphQLError } from 'graphql';

export default new GraphQLScalarType({
  // 1) --- ОПРЕДЕЛЯЕМ МЕТАДАННЫЕ ТИПА ---
  // У каждого типа, должно быть уникальное имя
  name: 'DateTimestamp',
  // Хорошим тоном будет предоставить описание для вашего типа,
  // чтобы оно отображалось в документации
  description: 'A string which represents a HTTP URL',

  // 2) --- ОПРЕДЕЛЯЕМ КАК ТИП ОТДАВАТЬ КЛИЕНТУ ---
  // Чтобы передать клиенту в GraphQL-ответе значение вашего поля
  // вам необходимо определить функцию `serialize`,
  // которая превратит значение в допустимый json-тип
  serialize: (v: Date) => v.getTime(), // return 1536417553

  // 3) --- ОПРЕДЕЛЯЕМ КАК ТИП ПРИНИМАТЬ ОТ КЛИЕНТА ---
  // Чтобы принять значение от клиента, провалидировать его и преобразовать
  // в нужный тип/объект для работы на сервере вам нужно определить две функции:

  // 3.1) первая это `parseValue`, используется если клиент
  // передал значение через GraphQL-переменную:
  // {
  //   variableValues: { "date": 1536417553 }
  //   source: `query ($date: DateTimestamp) { setDate(date: $date) }`
  // }
  parseValue: (v: integer) => new Date(v),

  // 3.2) вторая это `parseLiteral`, используется если клиент
  // передал значение в теле GraphQL-запроса:
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
</code></pre>

1. Определяем метаданные типа
2. Как сериализуем для отправки клиенту
3. Как де-сериализуем значение от клиента

<span class="fragment" data-code-focus="1-3" />
<span class="fragment" data-code-focus="4" />
<span class="fragment" data-code-focus="5-9" />
<span class="fragment" data-code-focus="11" />
<span class="fragment" data-code-focus="12-15" />
<span class="fragment" data-code-focus="17-19" />
<span class="fragment" data-code-focus="21-27" />
<span class="fragment" data-code-focus="29-41" />

-----

## Object types

Самый часто используемый конструктор типов в GraphQL - это `GraphQLObjectType`. Output-тип со списком полей:

<pre><code>const AuthorType = new GraphQLObjectType({
  // Уникальное имя вашего типа в рамках всей GraphQL-схемы. Обязательный параметр.
  name: 'Author',
  // Описание типа для документации (интроспекции). Желательно указывать.
  description: 'Author data with related data',
  // Интерфейсы реализуемые текущим типом (смотрите секцию `Interfaces`). Можно не указывать.
  interfaces: [],
  // Объявление полей, рекомендую не лениться и сразу объявлять через () => ({})
  // это позволяет в будущем избежать проблемы с hoisting'ом (когда у вас два типа импортят друг-друга)
  // Обязательный параметр, должно быть указано как минимум одно поле
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString }, //  <--- FieldConfig
  }),
});
</code></pre>

<span class="fragment" data-code-focus="3" />
<span class="fragment" data-code-focus="5" />
<span class="fragment" data-code-focus="7" />
<span class="fragment" data-code-focus="11-14" />

-----

## Object types — FieldConfig

- `type` — Output-тип возвращаемого значения (Scalar, Enum, OutputObject, Interface, Union, List, NonNull)
- `description` — описание поля для документации
- `deprecationReason` — строка, помечает поле как устаревшее
- `args` — набор аргументов, которые может принимать поле для уточнения возвращаемого значения в resolve-методе:
  - `type` — Input-тип (Scalar, Enum, InputObject, List, NonNull)
  - `defaultValue` — значение по-умолчанию
  - `description` — описание аргумента для документации
- `resolve` — метод получения данных, для текущего поля

-----

## Object types — FieldConfig — resolve(source, args, context, info)

- `source` — объект с данными, который был получен от resolve метода родительского поля.
- `args` — содержит провалидированные значения аргументов для поля, которые передал клиент в своем запросе.
- `context` — это ваш глобальный объект, который создается для каждого GraphQL-запроса и доступен во всех resolve методах
- `info` — содержит служебную информацию о текущем поле, пути в графе, GraphQL-схеме, выполняемом GraphQL-запросе и переменных.

-----

## Object types — Example

<pre><code>const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    // объявляем поле `authors`
    authors: { // FieldConfig:
      // устанавливаем, что это поле вернет нам массив авторов (тип который объявили выше)
      type: new GraphQLList(AuthorType),
      args: {
        // позволяем клиентам указать кол-во возвращаемых записей с помощью аргумента `limit`
        limit: {
          // принимаемое значение от клиента - Int
          // если будет передано неверное значение, то GraphQL прервет запрос на этапе валидации
          type: GraphQLInt,
          // если клиент не указал значение в запросе, тогда применится значение по-умолчанию - 10
          defaultValue: 10,
        },
      },
      // в методе `resolve` вы пишете свой код, для того чтобы получить необходимые записи из БД
      resolve: async (source, args, context, info) => {
        // Из `args` считываем `limit`.
        // Этот аргумент мы определили в конфигурации поля чуть выше, установив ему тип Int.
        // GraphQL не пропустит запрос, если в аргумент `limit` будет передана строка
        // или другой не верный тип. Так что дополнительно проверять тип поля нет необходимости.
        const { limit } = args;

        // Но вот проверить, что число отрицательное мы должны ручками.
        // Либо объявить свой кастомный скалярный тип `PositiveInt` (смотри секцию Custom Scalar),
        // чтоб не таскать эту проверку по всем резолверам для других полей.
        if (limit <= 0) throw new Error('`limit` argument MUST be a positive Integer.');

        // Предположим что на уровне настройки GraphQL-сервера мы в `context` положили подключение
        // к базе данных - `db`, у которой есть модель `Author` с асинхронным методом `find`.
        // Тогда мы можем запросить N авторов из БД следующим образом:
        let authors = await context.db.Author.find().limit(limit);

        // После получения данных, мы можем их дополнительно обработать прежде чем вернуть в GraphQL
        // Например, что-то посчитать, или поправить данные
        // давайте просто для примера отсортируем их в обратном порядке
        if (authors) {
          authors = authors.reverse();
        }

        // И передадим массив полученных данных в GraphQL. В свою очередь, GraphQL сделает следующее:
        // - если передан Promise, то дождется его выполнения и с полученным значение продолжит работу
        // - т.к. в типе объявлено `new GraphQLList(AuthorType)`, то GraphQL провалидирует что
        //   получен массив или `null` (иначе выбросит ошибку о неверных данных)
        // - затем каждый элемент массива `authors` передаст в тип `AuthorType` в качестве `source`
        //   и пробежится по всем полям:
        //   - если у поля есть метод `resolve`, то в качестве `source` будет передан текущий элемент
        //   из массива `authors`, который мы получили из БД.
        //   - если у поля нет метода `resolve`, то GraphQL выполнит дефолтный резолвер,
        //   который считывает из объекта свойтво с тем же именем что у поля.
        //   - если из БД были запрошены еще какие-то поля, которых нет в GraphQL-типе AuthorType,
        //   то клиент их не получит. Но они будут вам доступны в аргументе `source` метода `resolve`.
        return authors;
      },
    },
  },
});
</code></pre>

Подробно и с деталями — [читать тут](https://github.com/nodkz/conf-talks/blob/master/articles/graphql/types/README.md#object-types)

<span class="fragment" data-code-focus="1-2" />
<span class="fragment" data-code-focus="3" />
<span class="fragment" data-code-focus="5" />
<span class="fragment" data-code-focus="7" />
<span class="fragment" data-code-focus="8" />
<span class="fragment" data-code-focus="10" />
<span class="fragment" data-code-focus="13" />
<span class="fragment" data-code-focus="15" />
<span class="fragment" data-code-focus="19" />
<span class="fragment" data-code-focus="24" />
<span class="fragment" data-code-focus="29" />
<span class="fragment" data-code-focus="34" />
<span class="fragment" data-code-focus="39-41" />
<span class="fragment" data-code-focus="55" />

-----

## Input types

GraphQL для входящих аргументов полей может использовать следующие Input-типы:

- `GraphQLScalarType` — как встроенные Int, String, так и ваши кастомные скалярные типы
- `GraphQLEnumType` — это особый вид скаляров, о котором речь пойдет в другом разделе
- `GraphQLInputObjectType` — это сложные объекты, которые состоят из набора именованных полей
- а также любой микс из уже озвученных Input-типов с модификаторами `GraphQLList` и `GraphQLNonNull`

-----

## Input types — GraphQLInputObjectType

<pre><code>const ArticleInput = new GraphQLInputObjectType({
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
</code></pre>

Подробно и с деталями — [читать тут](https://github.com/nodkz/conf-talks/blob/master/articles/graphql/types/README.md#input-types)

<span class="fragment" data-code-focus="1" />
<span class="fragment" data-code-focus="3" />
<span class="fragment" data-code-focus="5" />
<span class="fragment" data-code-focus="9" />
<span class="fragment" data-code-focus="11" />
<span class="fragment" data-code-focus="13, 15, 17" />
<span class="fragment" data-code-focus="20, 22" />

-----

## Enumeration types

Также называемые Enums, это особый вид скаляра, <br/> который ограничен определенным набором <br/> допустимых значений (key-value).

- На клиентской стороне вы работаете только с ключами (`key`)
- На серверной стороне только со значениями (`value`)

-----

## Enumeration types — Example

<pre><code>const GenderEnum = new GraphQLEnumType({
  name: 'GenderEnum',
  values: {
    // key    value
    //  ↓       ↓
    MALE: { value: 1 },
    FEMALE: { value: 2 },
    CHUCK_NORRIS: {
      value: 3,
      description: "Значение для особо уважаемого человека",
      deprecationReason: `
        Какой-то ненормальный уже уволенный сотрудник завел это значение.
        Не используйте это поле, если не хотите повторить его судьбу.
      `,
    }
  },
});
</code></pre>

`key` — для клиентской стороны
<br/>`value` — доступно на сервере в resolve-методах
<br/>Подробно и с деталями — [читать тут](https://github.com/nodkz/conf-talks/blob/master/articles/graphql/types/README.md#enumeration-types)

-----

## Lists and Non-Null

Дополнительные модификаторы к типам (еще их называют "wrapping types"):

- `GraphQLList` — задает массив указанного типа
- `GraphQLNonNull` — указывает на то, что возвращаемое или получаемое значение не может быть пустым

По спецификации GraphQL любое Output поле является nullable a Input аргумент — optional, т.е. сервер может вернуть/принять значение указанного типа, либо null.

-----

### При этом вы можете комбинировать модификаторы:

  | SDL       |  JS | Значение |
  |--------------------|------|------------|
  | `[Int!]`  | new GraphQLList(new GraphQLNonNull(GraphQLInt))  | null или массив чисел |
  | `[Int]!`  | new GraphQLNonNull(new GraphQLList(GraphQLInt))  | массив чисел или null, пустой массив|
  | `[Int!]!` | new GraphQLNonNull( new GraphQLList(new GraphQLNonNull(GraphQLInt) )  | массив чисел или пустой массив |
  | `[[Int]]` | new GraphQLList(new GraphQLList(GraphQLInt))  | целочисленный массив-масивов |

-----

## Interfaces

`GraphQLInterfaceType` — это именованный абстрактный тип, который представляет собой набор именованных полей и их аргументов.

`GraphQLObjectType` может реализовать в дальнейшем этот интерфейс, при этом должны быть объявлены все поля и аргументы, которые определены в интерфейсе.

-----

## Interfaces — Definition

<pre><code>const EventInterface = new GraphQLInterfaceType({
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
</code></pre>

<span class="fragment" data-code-focus="2" />
<span class="fragment" data-code-focus="3-6" />
<span class="fragment" data-code-focus="7" />

-----

## Interfaces — Using in Output types

<pre><code>const ClickEventType = new GraphQLObjectType({
  name: 'ClickEvent',
  interfaces: [EventInterface], // <--Тип может использовать несколько интерфейсов
  fields: () => ({
    ip: { type: GraphQLString },
    createdAt: { type: GraphQLInt },
    url: { type: GraphQLString },
  }),
});
</code></pre>

<pre><code>const SignedUpEventType = new GraphQLObjectType({
  name: 'SignedUpEvent',
  interfaces: [EventInterface],
  fields: () => ({
    ip: { type: GraphQLString },
    createdAt: { type: GraphQLInt },
    login: { type: GraphQLString },
  }),
});
</code></pre>

-----

Теперь представим, что у нас в схеме есть `search` метод, который возвращает массив `EventInterface`

<pre><code>query {
  search {
    __typename # <----- магическое поле, которое вернет имя типа
    ip
    createdAt
  }
}
</code></pre>

<pre><code># получим следующий ответ:
# search: [
#   { __typename: 'ClickEvent', createdAt: 1536854101, ip: '1.1.1.1' },
#   { __typename: 'ClickEvent', createdAt: 1536854102, ip: '1.1.1.1' },
#   { __typename: 'SignedUpEvent', createdAt: 1536854103, ip: '1.1.1.1' },
# ]
</code></pre>

-----

При этом GraphQL позволяет дозапросить поля для конкретных типов через фрагменты:

<pre><code>query {
  search { // имеет тип [EventInterface]
    __typename
    ip
    createdAt
    ...on ClickEvent { // фрагмент уточнения типа (resolveType)
      url
    }
    ...on SignedUpEvent {
      login
    }
  }
}
</code></pre>

<pre><code># получим следующий ответ:
# search: [
#   { __typename: 'ClickEvent', createdAt: 1536854101, ip: '1.1.1.1', url: '/list' },
#   { __typename: 'ClickEvent', createdAt: 1536854102, ip: '1.1.1.1', url: '/register' },
#   { __typename: 'SignedUpEvent', createdAt: 1536854103, ip: '1.1.1.1', login: 'NICKNAME' },
# ]
</code></pre>

Подробно и с деталями — [читать тут](https://github.com/nodkz/conf-talks/blob/master/articles/graphql/types/README.md#interfaces)

-----

## Union types

Это другой абстрактный тип в GraphQL,

когда у вас нет общих полей.

<pre><code>import { GraphQLUnionType } from 'graphql';

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
</code></pre>

-----

#### Union types — всегда надо использовать фрагменты

<pre><code>query {
  search(q: "text") {
    __typename # <----- магическое поле, которое вернет имя типа для каждой записи
    ...on Article { # <----- типизированный фрагмент
      title
      publishDate
    }
    ...on Comment { # <----- типизированный фрагмент
      text
      author
    }
    ...on UserProfile { # <----- типизированный фрагмент
      nickname
      age
    }
  }
}
</code></pre>

<pre><code># получим следующий ответ:
# search: [
#   { __typename: 'Article', publishDate: '2018-09-10', title: 'Article 1' },
#   { __typename: 'Comment', author: 'Author 1', text: 'Comment 1' },
#   { __typename: 'UserProfile', age: 20, nickname: 'Nick 1' },
# ]
</code></pre>

Подробно и с деталями — [читать тут](https://github.com/nodkz/conf-talks/blob/master/articles/graphql/types/README.md#union-types)

-----

## Root types

Как вы уже знаете, GraphQL-запросы - иерархические и описывают древовидную структуру:

- если скалярные типы описывают листья вашего графа,
- Оbject-типы описывают промежуточные узлы,
- то Root-типы описывают корневые узлы (корни).

-----

#### Root-типов всего три, и они строятся c помощью обычного `GraphQLObjectType`:

- `Query` — этот тип описывает все доступные операции ("точки входа") для чтения. Если запросили несколько полей, то они выполняются параллельно.
- `Mutation` — для операции записи. Если запросили несколько полей, то они выполняются последовательно.
- `Subscription` — подписки, особый вид операций позволяющий клиентам подписаться на события произошедшие на сервере.

-----

#### Root-типы непосредственно добавляются в `GraphQLSchema`:

<pre><code>import { GraphQLSchema, GraphQLObjectType, graphql } from 'graphql';

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({ name: 'Query', fields: { getUserById, findManyUsers } }),
  mutation: new GraphQLObjectType({ name: 'Mutation', fields: { createUser, removeLastUser } }),
  subscriptions: new GraphQLObjectType({ name: 'Subscription', fields: ... }),
  // ... и ряд других настроек
});

// как схема готова, на ней можно выполнять запросы
const response = await graphql(schema, `query { ... }`);
</code></pre>

Ваше API начинается именно с этих типов:

<pre><code>query {
  getUserById { ... }
  findManyUsers { ... }
}
</code></pre>

Подробно и с деталями — [читать тут](https://github.com/nodkz/conf-talks/blob/master/articles/graphql/types/README.md#root-types)

-----

## Directives

Директивы в GraphQL - это дополнительные аннотации, которые:

- TypeSystemDirective — могут использоваться при описании схемы в SDL
- ExecutableDirective — могут использоваться в рантайме

-----

### TypeSystemDirective (при описании схемы)

- `@deprecated(reason: "Use 'newField'")` — встроенная в GraphQL директива
- [Prisma](https://www.prisma.io/docs/data-model-and-migrations/data-model-knul/#graphql-directives) добавляет свои `@unique`, `@default`, `@relation` и прочие
- [Apollo graphql-tools](https://www.apollographql.com/docs/graphql-tools/schema-directives.html) дает удобную помогайку для создания директив через шаблон `visitor`

-----

#### TypeSystemDirective (при описании схемы) —

#### отличная штука, если хотите расширить возможности SDL<br/><br/>

<pre><code>type Story {
  id: ID! @unique
  text: String!
  author: User! @relation(name: "WrittenStories")
}
</code></pre>

Пример из Prisma

-----

### ExecutableDirective (в рантайме)

- `@skip(if: true)`, `@include(if: true)` — чтобы запрашивать часть графа по условию, идет в пакете graphql из коробки.
- `@defer` — фишка, которая позволяет через лонг-полинг отложить получение данных из вашего запроса (надо шаманить сервер, в Apollo есть готовое решение).

-----

#### <br/> Хотите свою директиву в рантайме?

<pre><code>const UppercaseDirective = new GraphQLDirective({
  name: 'uppercase',
  description: 'Provides default value for input field.',
  locations: [DirectiveLocation.FIELD],
});
</code></pre>

<pre><code>const AuthorType = new GraphQLObjectType({
  name: 'Author',
  description: 'Author data with related data',
  fields: () => ({
    id: { type: GraphQLInt },
    name: {
      type: GraphQLString,
      resolve: (source, args, context, info) => {
        if (info.fieldNodes?.[0].directives?.[0]?.name?.value === 'uppercase') {
          return source.name.toUpperCase();
        }
        return source.name;
      },
    },
  }),
});
</code></pre>

<span class="fragment" data-code-focus="8-9" data-code-block="2">Ужос! Индусский код!</span>

-----

## Directives — итог

#### Директивы при создании схемы — OK!

#### Директивы в рантайме — только встроенные!

<br/>Подробно и с деталями — [читать тут](https://github.com/nodkz/conf-talks/blob/master/articles/graphql/types/README.md#directives)

-----

### Вся система типов очень подробно и доходчиво

### [расписана у меня в гитхабе](https://github.com/nodkz/conf-talks/blob/master/articles/graphql/types/README.md)

### на русском! 😃 <!-- .element: class="fragment" -->

#### <br /> Cпециально для вас в рамках подготовки к HolyJS <!-- .element: class="fragment" -->
