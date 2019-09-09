# Как работать с ошибками в GraphQL?

В любом приложении возникают ошибки, и в вашим GraphQL API они тоже будут. Се ля ви.

Как работать с ошибками в GraphQL? К чему необходимо быть готовым клиентам вашего АПИ? Как лучше возвращать ошибки клиенту? Да и как вообще они возвращаются в GraphQL? В этот статье мы разберем как работать с ошибками в GraphQL.

Для начала давайте бегло посмотрим какие ошибки могут возникать и сразу разобьем их на группы:

- ФАТАЛЬНЫЕ ОШИБКИ
  - 500 Internal Server Error
  - кончилась память
  - забыли установить пакет
  - грубая синтаксическая ошибка в коде
- ОШИБКИ ВАЛИДАЦИИ
  - ошибка невалидного GraphQL-запроса
  - запросили несуществующее поле
  - не передали обязательный аргумент
  - не передали переменную
- RUNTIME ОШИБКИ В RESOLVE-МЕТОДАХ
  - throw new Error("")
  - undefined is not a function (юзайте Flowtype или TypeScript уже в конце концов)
  - ошибка невалидного значения в return
- ПОЛЬЗОВАТЕЛЬСКИЕ ОШИБКИ
  - запись не найдена
  - недостаточно прав для просмотра или редактирования записи

## Как обычно GraphQL-сервер отвечает на ошибки?

Если произошла `фатальная` ошибка, то сервер возвращает 500 код. Это как обычно.

Но вот что необычное в GraphQL, так если произошла любая другая ошибка сервер возвращает код 200. Обычно бывалые REST API разработчики на этом моменте хотят выпрыгнуть из окна. Никаких вам 401, 403, 404 и прочих кодов не будет.

Сделали это так, потому что GraphQL по спецификации не привязан ни к какому протоколу. Вы можете гонять GraphQL-запросы через websockets, ssh, telnet ну и обычный http. Коль нет жесткой привязки к протоколу, то ошибки все унесли в тело ответа.

Вот так выглядит ответ от GraphQL по спецификации:

```js
{
  data: {}, // для возврата данных
  errors: [...], // для возврата ошибок, массив между прочим 😳
  extensions: {}, // объект для пользовательских данных, сюда пихайте что хотите
  // другие ключи запрещены по спеке!
}
```

Первое что бросается в глаза так это то, что GraphQL возвращает массив ошибок. Wow! Т.к. запрос может быть сложный с запросом кучи ресурсов, то GraphQL может вернуть вам часть данных, а на оставшуюся часть вернуть ошибки. И это хорошо, пол ответа лучше, чем ничего.

## Фатальные ошибки

Фатальная ошибка чаще всего имеет следующий вид — `500 Internal Server Error`. Возникает обычно если кончилась память, забыли установить пакет, совершили грубую синтаксическую ошибку в коде. Да много еще чего. При этом дело не доходит до обработки GraphQL-запроса. И здесь резонно вернуть 500 ошибку.

Нет работы GraphQL, нет кода 200.

Фронтендеры обычно это дело должны обрабатывать на уровне своего Network Layer'a. Получили 500, значит где-то косячнулись бэкендеры с админами.

## Ошибки валидации

Сервер получил запрос и делегировал его в пакет [graphql](https://github.com/graphql/graphql-js). Перед тем как GraphQL-запрос будет выполняться он проходит парсинг и валидацию. Если кривой запрос, то никакие resolve-методы вызваны не будут и тупо будет возвращена ошибка:

```js
{
  errors: [
    {
      message: 'Cannot query field "wrong" on type "Query".',
      locations: [{ line: 3, column: 11 }],
    },
  ],
}

// или например такая
{
  errors: [
    {
      message: 'Variable "$q" of required type "String!" was not provided.',
      locations: [{ line: 2, column: 16 }],
    },
  ],
}
```

При этом сервер вернет статус 200. При коде 200, ошибка обычно на стороне фронтендера. Но и бекендер может быть к этому причастен, если взял и удалил из схемы какое-то поле. В таком случае все старые работающие приложения теперь стали отправлять невалидные запросы.

## Runtime ошибки в resolve-методах

Если запрос прошел парсинг и валидацию, то он начинает выполняться и вызывать resolve-методы вашей схемы согласно присланному GraphQL-запросу. И если вдруг внутри resolve-метода вываливается Exception (`throw new Error()`), неважно явно вы его выбросили, или он прилетел из недр чужих пакетов. То происходит следующая магия:

- обработка ветки графа приостанавливается (вложенные resolve-методы вызываться не будут)
- на месте элемента, где произошла ошибка возвращается `null`
- ошибка добавляется в массив `errors`
- НО при этом соседние ветки продолжают работать

Хорошо это понять можно на примере следующего кода:

```js
const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      search: {
        args: {
          q: { type: GraphQLString },
        },
        resolve: (_, args) => {
          if (!args.q) throw new Error('missing q');
          return { text: args.q };
        },
        type: new GraphQLObjectType({
          name: 'Record',
          fields: {
            text: {
              type: GraphQLString,
              resolve: source => source.text,
            },
          },
        }),
      },
    },
  }),
});

const res = await graphql({
  schema,
  source: `
    query {
      s1: search(q: "ok") { text }
      s2: search { text }
      s3: search(q: "good") { text }
    }
  `,
});
```

Ответ от сервера будет получен следующий:

```js
{
  errors: [
    { message: 'missing q', locations: [{ line: 4, column: 11 }], path: ['s2'] }
  ],
  data: { s1: { text: 'ok' }, s2: null, s3: { text: 'good' } },
}
```

Поле `s1` возвращает полный результат. В `s2` была выброшена ошибка, поэтому оно стало `null` и в массив `errors` добавилась ошибка. И дальше поле `s3` тоже без проблем вернулось.

Т.е. получается на тех местах, где была выброшена ошибка возвращается `null` и пишется ошибка в массив. А вся остальная часть запроса продолжает выполняться как ни в чем не бывало. Вот такой вот он добрый GraphQL, хоть что-нибудь да вернет.

Точно также работает, если бэкендер вернул данные неправильного типа в resolve-методе. GraphQL не позволяет вернуть "левые данные" в `data`.  

Вот пример, когда мы по схеме должны вернуть массив строк, но второй элемент не является строкой. Вместо "левого" значения, он вернет `null` и при этом добавит ошибку в массив:

```js
const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      ooops: {
        type: new GraphQLList(GraphQLString),
        resolve: () => ['ok', { hey: 'wrong non String value' }],
      },
    },
  }),
});

const res = await graphql(schema, `query { ooops }`);

expect(res).toEqual({
  errors: [
    {
      message: 'String cannot represent value: { hey: "wrong non String value" }',
      locations: [{ line: 3, column: 11 }],
      path: ['ooops', 1],
    },
  ],
  data: { ooops: ['ok', null] },
});
```

Также спецификация GraphQL позволяет передать дополнительные данные вместе с ошибкой через проперти `extensions`. Давайте создадим объект ошибки и присвоим ему два проперти `extensions` и `someOtherData`:

```js
new GraphQLObjectType({
  name: 'Query',
  fields: {
    search: {
      resolve: () => {
        const e: any = new Error('Some error');
        e.extensions = { a: 1, b: 2 }; // will be passed in GraphQL-response
        e.someOtherData = { c: 3, d: 4 }; // will be omitted
        throw e;
      },
      type: GraphQLString,
    },
  },
});
```

На выходе в GraphQL-ответе мы получим следующие данные (`extensions` будет передан, а все другие проперти из объекта ошибки будут опущены, например не будет `someOtherData` из нашего примера):

```js
{
  errors: [
    {
      message: 'Some error',
      locations: [{ line: 1, column: 9 }],
      path: ['search'],
      extensions: { a: 1, b: 2 },
    },
  ],
  data: { search: null },
}
```

Такой механизм позволяет передать клиентам дополнительные данные об ошибке.

Ну коль заговорили про фронтенд, давайте пофантазируем как им работать с такими ошибками. На верхнем уровне одну ошибку в модальном окне вывести не проблема, а если ошибок две? А если у нас сложное приложение и ошибки надо показывать в разных частях приложения? Вот тут у фронтендера начинается просто адская боль и печаль с таким массивом ошибок. Его надо отдельно парсить, понимать какая именно ошибка произошла (например через `extensions.code`). Как-то передать ошибку в нужную компоненту и на нужный уровень. В общем, приходится сильно изгаляться в коде пробросом лишних проперти и логикой.

**Если вам интересно как бэкендер может упростить жизнь фронтендеру, то обязательно читайте следующий раздел.**

## Пользовательские ошибки

Что такое пользовательские ошибки? Ну это когда вам где-то в приложении надо вывести "запись не найдена", или "у вас нет прав просматривать этот контент", или "необходимо подтвердить возраст" или в списке на 23 элементе показать что "запись удалена".

Если пользоваться стандартным механизмом ошибок GraphQL. То на фронтенде приходится сильно изгаляться, чтобы пробросить ошибку в нужное место.

Но эту проблему можно достаточно элегантно решить, если ошибки возвращать прямо в `data` на нужном уровне, а не через глобальный массив `errors`. Для этого в GraphQL есть `Union-типы`, которые возвращают либо запись с данными, либо ошибку.

Давайте сразу к живому примеру. Представим что нам надо вернуть список видео. Причем какие-то видео в обработке, другие перед просмотром необходимо купить или подтвердить свой возраст. Так давайте и будем возвращать список, который может вернуть Union-тип из `Video`, `VideoInProgressProblem`, `VideoNeedBuyProblem` и `VideoApproveAgeProblem`. Со стороны фронтендера можно тогда написать вот такой запрос:

```graphql
query {
  list {
    __typename # <----- магическое поле, которое вернет имя типа для каждой записи
    ...on Video {
      title
      url
    }
    ...on VideoInProgressProblem {
      estimatedTime
    }
    ...on VideoNeedBuyProblem {
      price
    }
    ...on VideoApproveAgeProblem {
      minAge
    }
  }
}
```

Т.е. используем фрагменты на конкретных типах и запрашиваем поле `__typename`, которое возвращает имя типа. К запросу выше GraphQL-ответ будет следующий:

```js
{
  data: {
    list: [
      { __typename: 'Video', title: 'DOM2 in the HELL', url: 'https://url' },
      { __typename: 'VideoApproveAgeProblem', minAge: 21 },
      { __typename: 'VideoNeedBuyProblem', price: 10 },
      { __typename: 'VideoInProgressProblem', estimatedTime: 220 },
    ],
  },
}
```

При таком подходе фронтендер знает какие вообще ошибки могут быть. Также он получает ошибки в нужной компоненте, на нужном уровне. Код захламляется только там, где необходимо разобрать разные варианты пользовательских ошибок и вывести либо данные, либо красивый блок с ошибочкой.

Причем фронтендеры могут легко понять, какой тип ошибки вернулся. И при этом получить дополнительные данные по ошибке, если она их возвращает. Это же просто обычный тип в схеме, который может содержать в себе любые необходимые поля.

Для себя я вынес одно правило, что пользовательским ошибкам лучше всего давать суффикс `Problem`, а не `Error`. Это позволяет избежать путаницы как на бэкенде, так и на фронтенде.

Как это дело можно организовать на бэкенде? Достаточно просто. Вот пример:

```js
// Объявляем класс Видео
class Video {
  title: string;
  url: string;

  constructor({ title, url }) {
    this.title = title;
    this.url = url;
  }
}

// И сразу же объявим GraphQL-тип
const VideoType = new GraphQLObjectType({
  name: 'Video',
  fields: () => ({
    title: { type: GraphQLString },
    url: { type: GraphQLString },
  }),
});


// Объявим классы проблем (ошибок)
class VideoInProgressProblem {
  constructor({ estimatedTime }) {
    this.estimatedTime = estimatedTime;
  }
}
class VideoNeedBuyProblem {
  constructor({ price }) {
    this.price = price;
  }
}
class VideoApproveAgeProblem {
  constructor({ minAge }) {
    this.minAge = minAge;
  }
}

// И их типы для GraphQL
const VideoInProgressProblemType = new GraphQLObjectType({
  name: 'VideoInProgressProblem',
  fields: () => ({
    estimatedTime: { type: GraphQLInt },
  }),
});
const VideoNeedBuyProblemType = new GraphQLObjectType({
  name: 'VideoNeedBuyProblem',
  fields: () => ({
    price: { type: GraphQLInt },
  }),
});
const VideoApproveAgeProblemType = new GraphQLObjectType({
  name: 'VideoApproveAgeProblem',
  fields: () => ({
    minAge: { type: GraphQLInt },
  }),
});

// Ну а теперь самое интересное.
// Объявляем наш UNION-тип который будет возвращать либо видео, либо проблему-ошибку
const VideoResultType = new GraphQLUnionType({
  // Даем имя типу.
  // Здорово если если вы выработаете конвенцию в своей команде
  // и к таким Union-типам будете добавлять суффикс Result
  name: 'VideoResult',

  // как хорошие бекендеры добавляем какое-нибудь описание
  description: 'Video or problems',

  // объявляем типы через массив, которые могут быть возвращены
  types: () => [
    VideoType,
    VideoInProgressProblemType,
    VideoNeedBuyProblemType,
    VideoApproveAgeProblemType,
  ],

  // Ну и самое главное надо объявить функцию определения типа.
  // resolve-функции (смотри ниже поле Query.list) просто возвращают JS-объект
  // но вот GraphQL'ю нужно как-то JS-объект, сконвертировать в GraphQL-тип
  // иначе как он узнает что надо записать в поле __typename
  resolveType: value => {
    if (value instanceof Video) {
      return VideoType;
    } else if (value instanceof VideoInProgressProblem) {
      return VideoInProgressProblemType;
    } else if (value instanceof VideoNeedBuyProblem) {
      return VideoNeedBuyProblemType;
    } else if (value instanceof VideoApproveAgeProblem) {
      return VideoApproveAgeProblemType;
    }
    return null;
  },
});

// Ну и вишенка на торте
// Пишем простую схемку, которая нам возвращает массив из Видео и Ошибок-Проблем.
const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      list: {
        type: new GraphQLList(VideoResultType),
        resolve: () => {
          return [
            new Video({ title: 'DOM2 in the HELL', url: 'https://url' }),
            new VideoApproveAgeProblem({ minAge: 21 }),
            new VideoNeedBuyProblem({ price: 10 }),
            new VideoInProgressProblem({ estimatedTime: 220 }),
          ];
        },
      },
    },
  }),
});
```

Очень просто и красиво. А самое главное удобно для фронтендеров:

- знают какие ошибки могут быть
- знают какие поля содержатся в ошибках
- отлично поддерживается статический анализ, в отличии от обычных ошибок
- ошибки возвращаются в дереве ответа, а не в глобальном массиве
- в результате чище, проще и безопаснее код

**Любите брата фронтендера своего 😉 Иначе они придут с вилами!**

## Ссылки по теме

- [Примеры кода в виде тестов к этой статье](./__tests__/errors-test.js)
- [Видео про ошибки от Sasha Solomon](https://www.youtube.com/watch?v=GYBhHUGR1ZY)
- [Похожее видео про ошибки от Eloy Durán](https://www.youtube.com/watch?v=qKA-n8p-sNc), всё-таки у Саши лучше
