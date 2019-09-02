# GraphQL Types

Перед тем как строить GraphQL схему, хорошо бы разобраться из каких элементов ее можно собрать. В GraphQL существует две группы типов:

- `Output-типы` - для описания ответа от сервера.
- `Input-типы` - для описания входящих параметров от клиента.

Некоторые из типов могут относиться как к `Output`, так и `Input`-типам. Подробнее с каждой разновидностью можно ознакомиться в следующих разделах:

- [Scalar types](#scalar-types) (Output, Input)
- [Custom scalar types](#custom-scalar-types)  (Output, Input)
- [Object types](#object-types)  (только Output)
- [Input types](#input-types)  (только Input)
- [Enumeration types](#enumeration-types) (Output, Input)
- [Lists and Non-Null](#lists-and-non-null) (модификаторы типов для Output, Input)
- [Interfaces](#interfaces) (только Output)
- [Union types](#union-types) (только Output)
- [Root types](#root-types) (только Output)
- [Directives](#directives) (аннотации для типов и рантайма)

## Scalar types

Начнем с того, что в GraphQL существует 5 базовых скалярных типов из коробки:

- `GraphQLInt` — целое число (32-бита)
- `GraphQLFloat` — число с плавающей точкой (64-бита)
- `GraphQLString` — строка в формате UTF-8
- `GraphQLBoolean` — true/false
- `GraphQLID` — строка, которая является уникальным идентификатором (по мне так это левый тип, доставшийся нам от Фейсбука. Его могли смело выпилить из спецификации, но вот оставили кивая на какой-то refetch данных для кеша, видимо для Relay на клиентской стороне.)

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

Скалярные типы можно использовать как входящие значения для аргументов (от клиентов), так и как исходящие значения для полей ответа (от сервера).

## Object types

Самый часто используемый конструктор типов в GraphQL - это `GraphQLObjectType`. С его помощью описываются сложные объекты,  которые вы можете запросить с вашего сервера.

GraphQL-запросы иерархические и описывают древовидную структуру информации - если скалярные типы описывают листья вашего графа, то вот объекты описывают промежуточные узлы.

`GraphQLObjectType` представляет собой именованный тип со списком полей:

```js
const AuthorType = new GraphQLObjectType({
  // Уникальное имя вашего типа в рамках всей GraphQL-схемы. Обязательный параметр.
  name: 'Author',
  // Описание типа для документации (интроспекции). Желательно указывать.
  description: 'Author data with related data',
  // Интерфейсы реализуемые текущим типом (смотрите секцию `Interfaces`). Можно не указывать.
  interfaces: [],
  // Объявление полей, рекомендую не лениться и сразу объявлять через () => ({})
  // это позволяет в будущем избежать проблемы с hoisting'ом (когда у вас два типа импортят друг друга)
  // Обязательный параметр, должно быть указано как минимум одно поле
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
  }),
});
```

Ну а теперь самая важная часть во всем GraphQL - конфигурация полей. Необходимо четко понимать как конфигурировать поля, т.к. без этого у вас не заработает ни одна схема. Обычно это объект `{ [fieldName: string]: FieldConfig }`, где `fieldName` это имя поля (которое по спецификации содержит латинские буквы, цифры и нижнее подчеркивание, но не может начинаться с двух underscore'ов "__"); и `FieldConfig` со следующими проперти:

- `type` - Output-тип (Scalar, Enum, OutputObject, Interface, Union, List, NonNull) соответствующий возвращаемому значению
- `description` - описание поля для документации
- `deprecationReason` - строка, которая помечает поле как устаревшее и не рекомендует его дальнейшее использование.
- `args` - набор аргументов, которые может принимать поле для уточнения возвращаемого значения в `resolve`-методе. Описывается следующим объектом `{ [argName: string]: ArgConfig }`, где `ArgConfig` может содержать следующие значения:
  - `type` - Input-тип (Scalar, Enum, InputObject, List, NonNull)
  - `defaultValue` - значение по умолчанию, если явно не передано клиентом
  - `description` - описание аргумента для документации
- `resolve` - функция получения данных, для текущего поля. Должна вернуть данные или `Promise`, в том формате, который указан в проперти `FieldConfig.type` чуть выше. Еще можно вернуть `null`, если вы не хотите возвращать значение (например если у пользователя нет прав получать эту информацию). Либо явно выбросить ошибку `throw new Error()`, чтоб прервать запрос. Также эту функцию можно не объявлять, тогда GraphQL попытается считать это значение из получаемого аргумента `source[fieldName]`, о котором речь пойдет далее. На входе функция `resolve` получает четыре аргумента `(source, args, context, info)`:
  - `source` - объект с данными, который был получен от `resolve` метода родительского поля.
  - `args` - содержит провалидированные значения аргументов для поля, которые передал клиент в своем запросе. Доступные аргументы и типы описываются в проперти `FieldConfig.args` чуть выше.
  - `context` - это ваш объект, который создается для каждого GraphQL-запроса и доступен во всех `resolve` методах. Может содержать подключения к базам данных, разные служебные методы и данные (например текущую информацию из HTTP-request'а). Информацию о текущем авторизованном пользователе в рамках GraphQL-запроса однозначно надо хранить в контексте.
  - `info` - содержит служебную информацию о текущем поле, пути в графе, GraphQL-схеме, выполняемом GraphQL-запросе и переменных. Набор доступных значений можно посмотреть [тут](https://github.com/graphql/graphql-js/blob/046e724f341be532f2905621c0b9a0bad12ebac6/src/type/definition.js#L792-L803). Если вы хотите ограничить вложенность запроса, считать директивы с текущего поля, узнать какие поля запросил пользователь (чтобы только их запросить из базы) - то вам однозначно надо будет копаться в этом аргументе.

Для закрепления давайте разберем следующий `Query` тип, который позволяет запросить `authors` из базы данных:

```js
const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    // объявляем поле `authors`
    authors: {
      // устанавливаем, что это поле вернет нам массив авторов (тип который объявили выше)
      type: new GraphQLList(AuthorType),
      args: {
        // позволяем клиентам указать кол-во возвращаемых записей с помощью аргумента `limit`
        limit: {
          // принимаемое значение от клиента - Int
          // если будет передано неверное значение, то GraphQL прервет запрос на этапе валидации
          type: GraphQLInt,
          // если клиент не указал значение в запросе, тогда применится значение по умолчанию - 10
          defaultValue: 10,
        },
      },
      // в методе `resolve` вы пишете свой код, для того чтобы получить необходимые записи из БД
      resolve: async (source, args, context) => {
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
        //   который считывает из объекта свойство с тем же именем что у поля.
        //   - если из БД были запрошены еще какие-то поля, которых нет в GraphQL-типе AuthorType,
        //   то клиент их не получит. Но они будут вам доступны в аргументе `source` метода `resolve`.
        return authors;
      },
    },
  },
})
```

Также GraphQL имеет очень интересную фичу - объявление связей между типами. К примеру, у нас есть Автор (`AuthorType`) и у него есть список статей (`[ArticleType]`). Так вот, при запросе автора, вы сразу сможете запросить список конкретно его статей. GraphQL под капотом, сам сделает подзапрос чтобы вернуть вам необходимые данные. Всего навсего вам нужно создать, поле `articles` в `AuthorType` и объявить для него метод `resolve`:

```js
const AuthorType = new GraphQLObjectType({
  name: 'Author',
  description: 'Author data with related data',
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    // объявляем новое поле, которое пойдет в базу и запросит список статей
    articles: {
      // давайте позволим клиентам указывать кол-во вытаскиваемых статей из базы
      args: { limit: { type: GraphQLInt, defaultValue: 3 } },
      // установим возвращаемый тип данных - массив статей
      type: new GraphQLList(ArticleType),
      // и научим GraphQL получать список статей для конкретного автора
      resolve: (source, args, context) => {
        const { limit } = args;
        // как вы помните в `source` попадает объект с данными, который был получен
        // от `resolve` метода родительского поля.
        // В примере выше про `Query.authors` его `resolve` метод возвращает запись из БД
        // и скорее всего там есть поле `id`.
        const currentAuthorId = source.id;
        // Ну а если вдруг в `source` нет `id` пользователя, то у нас нет возможности запросить статьи
        // для текущего пользователя. Смело возвращаем `null`.
        if (!currentAuthorId) return null;

        // Предположим что в контексте есть модель Articles
        // поищем статьи, где поле `authorId` равен текущему id автора.
        const ArticlesModel = context.db.Articles;

        // Метод `find` асинхронный и вернет Promise, GraphQL прекрасно знает как с ним работать.
        // Если вам не нужно обрабатывать ответ от сервера, то нет смысла писать async/await как в примере выше.
        return ArticlesModel.find({ authorId: currentAuthorId }).limit(limit);
      },
    }
  }),
});
```

`GraphQLObjectType` самый важный конструктор типов. Очень важно разобраться в его работе, чтобы вы могли строить свои GraphQL-схемы. Поупражняться с ним вы можете в [файле с тестами](./__tests__/objectType-test.js).

## Input types

GraphQL для входящих аргументов полей может использовать следующие Input-типы:

- `GraphQLScalarType` - как встроенные `Int`, `String`, так и ваши кастомные скалярные типы
- `GraphQLEnumType` - это особый вид скаляров, о котором речь пойдет в другом разделе
- `GraphQLInputObjectType` - это сложные объекты, которые состоят из набора именованных полей
- а также любой микс из уже озвученных Input-типов с модификаторами `GraphQLList` и `GraphQLNonNull`

Важно знать, что `GraphQLObjectType` в качестве типа для входящей переменной использовать нельзя. Он просто слишком сложный, у него есть `args` (аргументы - которые непонятно как передавать и использовать), для полей есть `resolve` метод (задача которого готовить данные для вывода в ответе, а не ввода данных из запроса), есть `interfaces` от которых тоже нет особой практической пользы для Input-типа. Тем более для входных параметров надо иметь возможность задать значения по умолчанию `defaultValue`, которых нет в `GraphQLObjectType`. Да и в практике сложные объекты на ввод и вывод будут у вас отличаться. Например, чтобы отобразить данные по пользователю вам необходимо 3 поля (id, login, createdAt), а для создания всего 2 поля (login, password); т.к. поля id и createdAt генерятся на сервере, а отдача password через АПИ вообще чревата увольнением.

Чтобы не городить общий монстрообразный `ObjectType`, и сразу откреститься от банальных ошибок проектирования схемы - в GraphQL для сложных входящих объектов заведен отдельный конструктор типов `GraphQLInputObjectType`.

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
    // объявляем поле `title`
    title: {
      // тип поля String!
      type: new GraphQLNonNull(GraphQLString),
      // значение по умолчанию `Draft`
      defaultValue: 'Draft',
      // текстовое описание для документации АПИ:
      description: 'Article description, by default will be "Draft"',
    },
    // объявляем поле `text`
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

Поиграться с `GraphQLInputObjectType` вы можете в [файле с тестами](./__tests__/inputObjectType-test.js).

## Enumeration types

Также называемые Enums, это особый вид скаляра, который ограничен определенным набором допустимых значений (`key`-`value`). Это тип позволяет:

- Для клиентской стороны подтвердить, что поле этого типа содержит одно значение из допустимых `key`. Предоставить описание параметра и если необходимо отметку о том, что поле устарело (deprecated).
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
    CHUCK_NORRIS: {
      value: 3,
      description: "Значение для особо уважаемого человека.",
      deprecationReason: `
        Какой-то ненормальный уже уволенный сотрудник завел это значение. Не используйте это поле, если не хотите повторить его судьбу.
      `,
    }
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

Прошу обратить внимание на важный нюанс, когда вы используете объекты в качестве `value` для Enum. GraphQL использует строгое сравнение === для проверки `key` (для приема переменных от клиента) и `value` (для конвертации в ключ, чтоб вернуть клиенту). И если сравнение `ключей` от клиента никаких проблем не вызывает (`ID_ASC === ID_ASC` возвращает `true`). То вот возвращаемые `value` для Enum'ов в виде объектов на стороне сервера уже так просто переварены быть не могут (т.к. в JS `{ id: 1 } === { id: 1 }` возвращает `false`). Вам всегда надо использовать один и тот же объект, который указан в конфиге. Более детально эта проблема разобрана в [тестах](./__tests__/enumType-test.js).

Обычно народ не заморачивается с Enum'ами и всегда делает `key` и `value` одинаковыми, чтоб не иметь проблем с тем что передает и получает клиент, и тем что по факту прилетает в аргументах резолвера на сервере. Но вы то теперь знаете, как устроен Enum изнутри и можете его использовать на полную катушку.

## Lists and Non-Null

Когда вы объявляете поля в GraphQL схеме, то вы можете применить дополнительные модификаторы к типам (еще их называют "wrapping types"):

- `GraphQLList` - задает массив указанного типа, например массив чисел `new GraphQLList(GraphQLInt)`
- `GraphQLNonNull` - указывает на то, что возвращаемое или получаемое значение не может быть пустым (иметь тип `null` или `undefined`). По спецификации GraphQL любое Output поле является `nullable` a Input аргумент - `optional`, т.е. сервер может вернуть/принять значение указанного типа, либо `null`. И если вам необходимо сделать поле обязательным (для Input или Output-типов), чтобы оно не могло принимать или возвращать `null`, то его необходимо специально обернуть в `GraphQLNonNull`. Например: `new GraphQLNonNull(GraphQLInt)`.

При этом вы можете комбинировать модификаторы:

- `new GraphQLList(new GraphQLNonNull(GraphQLInt))` - может быть `null` или массив чисел. В SDL пишется так `[Int!]`.
- `new GraphQLNonNull(new GraphQLList(GraphQLInt))` - однозначно массив, у которого значения могут быть числом или `null`. При этом пустой массив (0 элементов), является валидным значением. В SDL пишется так `[Int]!`.
- `new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLInt)))` - однозначно массив с числами. Пустой массив будет валидным значением, а вот `[null]` - уже невалидным. В SDL пишется так `[Int!]!`.
- `new GraphQLList(new GraphQLList(GraphQLInt))` - целочисленный массив массивов, где на любом уровне может быть `null`. В SDL пишется так `[[Int]]`.

Эти модификаторы применяются как к Output-типам, так и к Input-типам. Если с сервера вы попытаетесь отдать некорректный тип, то получите ошибку. Тоже самое работает и с получением аргументов от клиента, если, например не указано обязательное поле, то запрос не будет выполнен и клиент получит ошибку.

## Interfaces

В GraphQL есть интерфейсы. Интерфейс - это именованный абстрактный тип который представляет собой набор именованных полей и их аргументов. `GraphQLObjectType` может реализовать в дальнейшем этот интерфейс, при этом должны быть объявлены все поля и аргументы, которые определены в интерфейсе.

Поля в интерфейсе могут иметь следующие типы: `Scalar`, `Object`, `Enum`, `Interface`, `Union`, а также эти пять базовых типов обернутых в `List` или `NonNull`.

Давайте смоделируем ситуацию, чтоб стало немного понятнее когда можно использовать интерфейсы. Представим, что мы храним в базе разного рода события - `Событие_Клик` и `Событие_Регистрация`. У всех событий есть общие поля - это `ip` и `createdAt`. При этом у каждого конкретного типа есть свои уникальные атрибуты; для клика это `url`, а для регистрации это `login`. Ну теперь можно создать наш интерфейс `EventInterface`, реализовать его в типах `ClickEvent`, `SignedUpEvent`, собрать GraphQL-схему и посмотреть как все это дело можно использовать в GraphQL-запросах.

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

Таким образом, вы можете объявить, что поле возвращает `InterfaceType` и тут же запрашивать общие поля доступные в интерфейсе. А если указать конкретные типы, то дозапросить дополнительные поля для записи, которые имеют соотвествующий тип.

Рабочий пример можно посмотреть в [тестах](./__tests__/interfaceType-test.js).

К сожалению, по состоянию на конец 2018 года GraphQL не поддерживает интерфейсы для Input-типов. Вы можете использовать интерфейсы только для Output-типов.

## Union types

В GraphQL помимо Interfaces, существует еще один абстрактный тип - `GraphQLUnionType`. Когда вам необходимо описать поле, которое может возвращать значения разного типа. В такой ситуации вы можете воспользоваться Union-типом. Для юнион типа, вы можете использовать только сложные типы построенные с помощью `GraphQLObjectType`. Скалярные типы, инпут типы, интерфейсы использовать нельзя.

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

Union-типом отличается от Interface-типа тем, что не содержит общих полей. Это означает, что вы не сможете запрашивать общие поля без явного указания типизированного фрагмента.

Если наш `search` метод будет возвращать массив элементов `SearchRowType`, то GraphQL-запрос можно будет строить следующим образом:

```graphql
query {
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

Особый вид типов, который используется для построения вашей GraphQL-схемы. Как вы уже знаете GraphQL-запросы иерархические и описывают древовидную структуру - если скалярные типы описывают листья вашего графа, Оbject типы описывают промежуточные узлы, то Root типы описывают корневые узлы (корни). Данных типов всего три и они строятся c помощью обычного `GraphQLObjectType`:

- `Query` - этот тип описывает все доступные операции ("точки входа") для чтения. Если запросили несколько полей, то они выполняются `параллельно`.
- `Mutation` - для операции записи. Если запросили несколько полей, то они выполняются `последовательно` (т.к. вызов предыдущего поля, может повлиять на результат изменения следующего поля).
- `Subscription` - подписки, особый вид операций позволяющий клиентам `подписаться на события` произошедшие на сервере. Например: клиент подписывается на добавление статьи, и как только будет добавлена статья, то сервер выполнит GraphQL-запрос и полученный ответ отправит клиенту. И это будет происходить для каждой новой статьи, пока клиент не отпишется. Грубо говоря, реальное выполнение GraphQL-запроса инициируется самим сервером на какое-то событие.

В `GraphQLSchema` обязательным параметром является только `query`, без него схема просто не запустится. Инициализация схемы выглядит следующим образом:

```js
import { GraphQLSchema, GraphQLObjectType, graphql } from 'graphql';

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({ name: 'Query', fields: { getUserById, findManyUsers } }),
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

Особо хочется остановиться на состоянии операций:

- `stateless` - должны быть `Query` и `Mutation`, т.е. если у вас в кластере много машин обслуживающих запросы клиентов, то неважно на какой из серверов прилетел запрос. Его может выполнить любая нода.
- `statefull` - должен быть у `Subscription`, т.к. требуется установка постоянного подключения с клиентом, хранения данных о подписках, механизмом переподключения и восстановлением данных о существующих подписках. Пакет `graphql` никак не помогает в решении этих админских проблем.

## Directives

Директивы в GraphQL это дополнительные аннотации, которые:

- **могут использоваться при генерации схемы** (`TypeSystemDirective`) в SDL (Schema Definition Language). Например, их активно используют:
  - [Prisma](https://www.prisma.io/docs/data-model-and-migrations/data-model-knul/#graphql-directives) использует их когда вам необходимо указать что поле уникальное (`@unique`) или указать дефолтное значение (`@default`).
  - [Apollo graphql-tools](https://www.apollographql.com/docs/graphql-tools/schema-directives.html) для enforcing access permissions, formatting date strings, auto-generating resolver functions for a particular backend API, marking strings for internationalization, synthesizing globally unique object identifiers, specifying caching behavior, skipping or including or deprecating fields, and just about anything else you can imagine.
  - `@deprecated(reason: "Use 'newField'")` встроенная директива по спецификации `graphql` для указания того, что поле помечено как устаревшее и не рекомендуется к использованию. Может применяться в Object-типе и Enum'е.
- **могут использоваться в рантайме** (`ExecutableDirective`) для GraphQL-запросов:
  - `@skip(if: true)`, `@include(if: true)` - чтобы запрашивать часть графа по условию, идет в пакете `graphql` из коробки. Может использоваться на Output-полях и фрагментах.
  - `@defer` - фишка которая позволяет через лонг-полинг отложить получение данных из вашего запроса (вы получаете основной ответ и рендерите его, а подграфы помеченные `@defer` прилетают отдельно). Этой штуке уже много лет в Relay, но широкое распространение она получила только недавно с [Apollo Client](https://www.apollographql.com/docs/react/features/defer-support.html#defer-setup)

Если вы объявляете свою GraphQL-схему через пакет `graphql`, то вам точно не потребуются директивы для генерации схемы (т.к. конструкторы типов `GraphQL*Type` пока не умеют работать с ними). И сам Lee Byron [писал](https://github.com/graphql/graphql-js/pull/746#issuecomment-301554231), что зачем вам куцые директивы, когда у вас есть мощь всего вашего языка программирования и вы можете все объявить явно при создании типов и в методе `resolve`. Хотя я неоднократно совершал набеги на то, что директивы желательно добавить в конструкторы типов: [тут](https://github.com/graphql/graphql-js/issues/1343#issuecomment-401749793) и [тут](https://github.com/graphql/graphql-js/issues/1262).

Директивы объявляются и добавляются в схему следующим образом:

```js
import { GraphQLDirective, DirectiveLocation, GraphQLNonNull } from 'graphql';
import GraphQLJSON from 'graphql-type-json';

const DefaultValueDirective =  new GraphQLDirective({
  name: 'default',
  description: 'Provides default value for output field.',
  locations: [DirectiveLocation.FIELD],
  args: {
    value: {
      type: new GraphQLNonNull(GraphQLJSON),
    },
  },
});

const schema = new GraphQLSchema({
  directives: [DefaultValueDirective],
  query: ...
});
```

В сухом остатке, директивами реально неудобно пользоваться в vanilla `graphql`, достаточно глянуть [файл с тестами](./__tests__/directive-test.js). Но это не означает что директивы зло, они отлично работают в пакетах обертках над `graphql` - [graphql-tools](https://github.com/apollographql/graphql-tools), [graphql-cost-analysis](https://github.com/pa-bru/graphql-cost-analysis), [graphql-compose](https://github.com/graphql-compose/graphql-compose).

## Ссылки по теме

- [Schemas and Types (официальный сайт)](https://graphql.org/learn/schema/)
- [Спецификация GraphQL по типам](http://facebook.github.io/graphql/draft/#sec-Type-System)
