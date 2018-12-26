# Дизайн GraphQL-схем — делаем АПИ удобным, избегаем боль и страдания

Рекомендации и правила озвученные в этой статье были выработаны за 3 года использования GraphQL как на стороне сервера (при построении схем) так и на клиентской стороне (написания GraphQL-запросов и покрытием клиентского кода статическим анализом). Также в этой статье используются рекомендации и опыт Caleb Meredith (автора PostGraphQL, ex-сотрудник Facebook) и иженеров Shopify.

Эта статья может поменяться в будущем, т.к. текущие правила носят рекомендательный характер и могут со временем улучшиться, измениться или вовсе стать антипаттерном. Но то что здесь написано, выстрадано временем и болью от использования кривых GraphQL-схем.

## TL;DR всех правил

### 1. Правила именования

- Используйте `camelCase` для именования GraphQL-полей и аргументов.
- Используйте `UpperCamelCase` для именования GraphQL-типов.
- Используйте `CAPITALIZED_WITH_UNDERSCORES` для именования значений ENUM-типов.

### 2. Правила типов

- Используйте кастомные скалярные типы, если вы хотите объявить поля или аргументы с определенным семантическим значением.
- Используйте Enum для полей, которые содержат определенный набор значений.

### 3. Правила полей

- Давайте полям понятные смысловые имена, а не то как они реализованы
- Rule #6: Group closely-related fields together into subobjects.

### 4. Правила аргументов

- Rule #20: Use stronger types for inputs (e.g. DateTime instead of String) when the format may be ambiguous and client-side validation is simple. This provides clarity and encourages clients to use stricter input controls (e.g. a date-picker widget instead of a free-text field).
- Rule #18: Only make input fields required if they're actually semantically required for the mutation to proceed.

### 5. Правила списков

- Для фильтрации списков используйте аргумент `filter` c типом Input, который содержит в себе все доступные фильтры.
- Для сортировки списков используйте аргумент `sort`, который должен быть массивом перечисляемых значений [Enum!].
- Для ограничения возвращаемых элементов в списке используйте аргументы `limit` со значением по-умолчанию и `skip`.
- Для пагинации используйте аргументы `page`, `perPage` и возвращайте output-тип с полями `items` с массивом элементов и `pageInfo` с мета-данными для удобной отрисовки страниц на клиенте.
- Для бесконечных списков (infinite scroll) используйте [Relay Cursor Connections Specification](https://facebook.github.io/relay/graphql/connections.htm).

### 6. Правила Мутаций

- Используйте Namespace-типы для группировки мутаций в рамках одного ресурса!
- Забудьте про CRUD - cоздавайте небольшие мутации для разных логических операций над ресурсами.
- Рассмотрите возможность выполнения мутаций сразу над несколькими элементами (однотипные batch-изменения).
- У мутаций должны быть четко описаны все обязательные аргументы, не должно быть вариантов либо-либо.
- Rule #19: Use weaker types for inputs (e.g. String instead of Email) when the format is unambiguous and client-side validation is complex. This lets the server run all non-trivial validations at once and return the errors in a single place in a single format, simplifying the client.
- Rule #21: Structure mutation inputs to reduce duplication, even if this requires relaxing requiredness constraints on certain fields.
- Rule #22: Mutations should provide user/business-level errors via a userErrors field on the mutation payload. The top-level query errors entry is reserved for client and server-level errors.
- Rule #23: Most payload fields for a mutation should be nullable, unless there is really a value to return in every possible error case.

### 7. Правила реляций между типами (relationships)

- Rule #1: Always start with a high-level view of the objects and their relationships before you deal with specific fields.
- Rule #8: Always use object references instead of ID fields.

### 8. Правила по бизнес-логике
  
- Rule #2: Never expose implementation details in your API design.
- Rule #3: Design your API around the business domain, not the implementation, user-interface, or legacy APIs.
- Rule #5: Major business-object types should always implement Node.
- Rule #12: The API should provide business logic, not just data. Complex calculations should be done on the server, in one place, not on the client, in many places.
- Rule #13: Provide the raw data too, even when there’s business logic around it.

### 9. Правила по версионированию схемы

- Rule #4: It’s easier to add fields than to remove them.
- Unique payload type. Use a unique payload type for each mutation and add the mutation’s output as a field to that payload type.

---

## 1. Правила именования

GraphQL для проверки имен полей и типов использует следующую регулярку `/[_A-Za-z][_0-9A-Za-z]*/`. Согласно нее можно использовать `camelCase`, `under_score`, `UpperCamelCase`, `CAPITALIZED_WITH_UNDERSCORES`. Слава богу `kebab-case` ни в каком виде не поддерживается.

Так что же лучше выбрать для именования?

Абстрактно можно обратиться к исследованию [Eye Tracking'а](http://www.cs.kent.edu/~jmaletic/papers/ICPC2010-CamelCaseUnderScoreClouds.pdf) по  `camelCase` и `under_score`. В этом исследовании явного фаворита не выявлено.

Коль исследования особо не помогло. Давайте будем разбираться в каждом конкретном случае.

### Именование полей и аргументов

Названиями полей активнее всего пользуются потребители GraphQL-апи, т.е. наши любымые клиенты — браузеры с JavaScript и разработчики мобильных приложений. Давайте посмотрим, что чаще всего используется по их конвенции для именования переменных. Ведь если клиенты дергают ваше апи, то скорее всего они будут использовать ваше именование для переменных у себя в коде. Ведь маппить (алиасить) название полей в удобный формат не шибко интересная работа.

Согласно [википедии](https://en.wikipedia.org/wiki/Naming_convention_(programming)) следующие клиентские языки (потребители GraphQL апи) придерживаются следующих конвенций по именованию переменных:

- JavaScript — `camelCase`
- Java — `camelCase`
- Swift — `camelCase`
- Kotlin — `camelCase`

Конечно каждый у себя "на кухне" может использовать `under_score`. Но в среднем по больнице  используется `camelCase`. Если найдете какое-нибудь исследование по процентовки использованию `camelCase` и `under_score` в том или ином языке программирования — дайте пожалуйста знать, очень тяжело гуглится вся это тема. Кругом сплошной субъективизм.

А ещё, если залезть в кишки graphql и посмотреть его [IntrospectionQuery](https://github.com/graphql/graphql-js/blob/master/src/utilities/introspectionQuery.js), то он также написан используя `camelCase`.

Таким образом, чтоб удовлетворить большинство ваших клиентов по именованию полей:

<div class="design-rule">
  Используйте `camelCase` для именования GraphQL-полей.
</div>

PS. Мне очень печально видеть в документации MySQL или PostgreSQL примеры с названием полей через `under_score`. Потом все это дело качует в код бэкенда, далее появляется в GraphQL апи, а потом и в коде клиентов. Блин, ведь эти БД спокойно позволяют сразу объявить поля в `camelCase`. Но так как на начале не определились с конвенцией имен, а взяли как в документашке, то потом происходят холивары что `under_score` лучше чем `camelCase`. Ведь переименовывать поля на уже едущем проекте больно и черевато ошибками. Вобщем тот кто выбрал `under_score`, тот и должен маппить поля в `camelCase`!

### Именование типов

А вот именование типов, в отличии от полей уже происходит немного по другому.

В самом GraphQL уже есть стандартные скалярные типы `String`, `Int`, `Boolean`, `Float`. Они именуются через `UpperCamelCase`.

Также внутренние типы GraphQL-интроспекции `__Type`, `__Field`, `__InputValue` и пр. Именуются через `UpperCamelCase` с двумя андерскорами в начале.

А еще GraphQL статический типизированный язык запросов. И из GraphQL-запросов много кто генерирует тайп-дефинишены для статического анализа кода. Так вот если посмотреть как в JS именуют сложные типы во Flowtype и TypeScript — то тут тоже обычно используется `UpperCamelCase`.

Таким образом, чтоб не быть "белой вороной", быть понятным и удобным для большинства:

<div class="design-rule">
Используйте `UpperCamelCase` для именования GraphQL-типов.
</div>

### Именование значений для Enum'ом

Enum в GraphQL используются для перечисления списка возможных значение у некого типа.

В самом GraphQL для интроспекции в типе `__TypeKind` используются следующие значения: `SCALAR`, `OBJECT`, `INPUT_OBJECT`, `NON_NULL`  и другие. Т.е. используется `CAPITALIZED_WITH_UNDERSCORES`.

Если относиться к Enum-типу как к типу с набором констант. То в большинстве языков программирования константы именуются через `CAPITALIZED_WITH_UNDERSCORES`.

Также `CAPITALIZED_WITH_UNDERSCORES` будет хорошо смотреться в самих GraphQL-запросах, чтобы четко индетифицировать Enum'ы:

```graphql
query {
  findUser(sort: ID_DESC) {
    id
    name
  }
}
```

Опять таки дабы не расширять энтропию, надо быть как все:

<div class="design-rule">
Используйте `CAPITALIZED_WITH_UNDERSCORES` для именования значений ENUM-типов.
</div>

## 2. Правила типов

GraphQL по спецификации содержит всего 5 типов скалярных полей `String` (строка), `Int` (целое число), `Float` (число с точкой), `Boolean` (булевое значение), `ID` (строка с уникальным индетификатором). Все эти типы легко и понятно передаются через JSON на любом языке программирования.

А вот когда речь заходит о каком-то скалярном типе не входящего в синтаксис JSON, например `Date`. То тут уже необходимо бэкендеру самостоятельно определяться с форматом данных, чтоб их можно было сериализовать и передать через JSON клиенту. А также легко и просто получить значение этого типа от клиента и десериализовать его на сервере.

В таких случаях GraphQL позволяет создавать свои кастомные скалярные типы. О том как это делается [написано здесь](../types/README.md#custom-scalar-types).

### Кастомные скалярные типы упрощают понимание формата значений

Если ваше поле возвращает тип `String`, то клиентам вашего апи сложно понять какие ограничения или семантическое значение содержиться в этой строке. Например с помощью типа `String` вы можете передавать обычный текст, HTML, строку длиной в 255 символов, строку в base64, дату или любое другое значение в конкретном формате.

Для того чтобы сделать ваше АПИ более прозрачным для команды, создавайте кастомные скалярные типы. Например: `HTML`, `String255`, `Base64`, `DateString`. Бэкендерам и фронтендерам это позволит единожды написать правила валидации и проверки таких типов и не дублировать код в каждом месте где они будут использоваться.

```diff
type Article {
  id: ID!
-  description: String
+  description: HTML
}
```

В таком случае легче понимать, что конкретно прилетает в поле `description`. И понятно что строку не надо эскейпить для отображения в браузере, а показывать как есть.

<div class="design-rule">
Используйте кастомные скалярные типы, если вы хотите объявить поля или аргументы с определенным семантическим значением.
</div>

### Enum для полей с определенным набором значений

Частенько в схемах встречаются поля, которые содержат определенный набор значений. Например: `пол`, `статус заявки`, `код страны`, `вид оплаты`. Использовать просто тип `String` или `Int` в таких случаях никоим образом не помогает вашим клиентам понять, какие значения могут быть получены.

Конечно доступные значения можно описать в документации. Но я не вижу смысла этого делать, когда в GraphQL есть тип `Enum` — [читать подробнее](../types/README.md#enumeration-types).

Значения полей с типом `Enum` проверяются на этапе валидации запроса. А также они могут проверяться на этапе разработки линтерами и статическими анализаторами. Это на порядок полезнее и безопаснее, чем тупо перечислять значения в документашке.

```diff
type User {
  id: ID!
-  gender: String
+  gender: Gender
}

+ enum GenderEnum {
+   MALE
+   FEMALE
+ }
```

<div class="design-rule">
Используйте Enum для полей, которые содержат определенный набор значений.
</div>

## 3. Правила полей

### Понятные имена для полей

Необходимо полям давать понятные имена. Это очень простое и банальное правило. К примеру у нас есть следующий тип:

```diff
type Meeting {
  title: String
-  bodyHtml: String
+  description: HTML
}
```

Человек который в первый раз видит тип `Meeting`, будет гадать что конкретно хранится в поле `bodyHtml`. Здорово если бэкендеры не ленятся и оставляют описание к полям. Но черт возьми, можно же поле в АПИ назвать `description`, а в базе пусть хранится как `bodyHtml`, тогда и документашку читать не нужно.

<div class="design-rule">
Давайте полям понятные смысловые имена, а не то как они реализованы
</div>

## 5. Правила списков

Я не встречал ни одного АПИ, которое бы не возвращало список элементов. Либо это постраничная листалка, либо что-то построенное на курсорах для бесконечных списков. Списки надо фильтровать, сортировать, ограничивать кол-во возвращаемых элементов. Сам GraphQL никак не ограничивает свободу реализации, но для того чтобы сформировать некое единообразие, необходимо ввести стандарт.

### Фильтрация списков

Как вы думаете, как лучше организовать фильтрацию?

```graphql
type Query {
  articles(authorId: Int, tags: [String], lang: LangEnum): [Article]
}
```

или через аргумент `filter` с типом `ArticleFilter`:

```graphql
type Query {
  articles(filter: ArticleFilter): [Article]
}

input ArticleFilter {
  authorId: Int
  tags: [String]
  lang: LangEnum
}
```

Конечно, лучше всего организовать через дополнительный тип `ArticleFilter`. На это есть несколько причин:

- если вы будете добавлять новые аргументы не относящиеся к фильтрации (сортировка, лимит, офсет, номер страницы, курсор, язык и прочее), то ваши агрументы не будут путаться друг с другом
- на клиенте для статического анализа вы получите `ArticleFilter` тип. Иначе клиенты будут вынуждены собирать такой тип вручную, что черевато ошибками
- тупо легче читать и воспринимать вашу схему, когда в ней 3-5 аргументов а не 33 аргумента с возможной фильтрацией. Есть аргумент `filter` и если нужно провались в него и там уже посмотри все 33 поля для фильтрации
- этот фильтр можно переиспользовать несколько раз в вашем апи, если список статей можно запросить из нескольких мест

Также важно договориться как назвать поле для фильтрации. А то если у вас 5, 10 или 100 разработчиков, то на выходе в схеме у вас появиться куча названий для аргумента фильтрации — `filter`, `where`, `condition`, `f` и прочий нестандарт. Если учитывать что есть базы SQL и noSQL, есть всякие кэши и прочие сервисы, то **самым адекватным именем для аргумента фильтрации является — `filter`**. Оно понятно и подходит для всех! А вот этот `where` только для SQL-бэкендеров.

<div class="design-rule">
Для фильтрации списков используйте аргумент `filter` c типом Input, который содержит в себе все доступные фильтры.
</div>

### Сортировка списков

Когда в списке много записей, то может потребоваться сортировка по полю. А иногда требуется сортировка по нескольким полям.

Для начала команде необходимо выбрать имя для аргумента сортировки. На ум приходит следующие популярные названия — `sort`, `order`, `orderBy`. Т.к. слово `order` переводиться не только как порядок, но и как заказ; и используется в основном только в реляционных базах данных. **То лучшим выбором имени для поля сортировки будет — `sort`.** Оно однозначно трактуется и будет понятно всем.

Когда с именем аргумента определились, то необходимо выбрать тип для аргумента сортировки:

- Если взять `String`, то фронтендеру будет тяжело указать правильные значения и при этом мы не получаем возможности валидации параметров средствами GraphQL.
- Можно создать input-тип `input ArticleSort { field: SortFieldsEnum, order: AscDescEnum }` — структура у которой можно выбрать имя поля и тип сортировки. Но такой подход не подойдет, если у вас появится полнотекстовая сортировка или сортировка по близости. У них просто нет значения DESC (обратной сортировки).
- Остается один самый простой и верный способ — использовать Enum для перечисления списка доступных сортировок `enum ArticleSort { ID_ASC, ID_DESC, TEXT_MATCH, CLOSEST }`. Т.е. в таком случае вы можете явно указать доступные способы для сортировки.

Также если внимательно прочитать как [объявляются типы Enum](../types/README.md#enumeration-types) на сервере, то помимо ключа `ID_ASC`, можно задать значение `id ASC` (для SQL), либо `{ id: 1 }` (для NoSQL). Т.е. клиенты видят унифицированный ключ `ID_ASC`, а вот на сервере в resolve-методе вы получаете уже готовое значение для подстановки в запрос. Конвертация ключа сортировки происходит внутри Enum-типа, что в свою очередь сделает код вашего resolve-метод меньше и чище.

Ну а теперь, чтобы иметь возможность сортировать по нескольким полям, нам просто необходимо дать возможность передавать массив значений для сортировки. В итоге получим следующее объявление сортировки:

```graphql
type Query {
  articles(sort: [ArticleSort!]): [Article]
}

enum ArticleSort {
  ID_ASC, ID_DESC, TEXT_MATCH, CLOSEST
}
```

Таким образом правило для сортировки списков звучит так:

<div class="design-rule">
Для сортировки списков используйте аргумент `sort`, который должен быть массивом перечисляемых значений [Enum!].
</div>

### Ограничение возвращаемых данных

С ограничением кол-ва элементов в списке и возможностью сдвига все банально просто. Используйте аргументы с названиями `limit` и `skip`. Единственно для лимита хорошо бы задать значение по-умолчанию, чтоб клиенты могли не указывать это значение.

```graphql
type Query {
  articles(
    limit: Int = 20
    skip: Int
  ): [Article]
}
```

<div class="design-rule">
Для ограничения возвращаемых элементов в списке используйте аргументы `limit` со значением по-умолчанию и `skip`.
</div>

### Пагинация

Альтернативой для ограничения возвращаемых элементов в списке `limit` и `skip` может выступить пагинация.

Для пагинации лучше всего использовать аргументы с именами `page` и `perPage` со значениями по-умолчанию:

```graphql
type Query {
  articles(
    page: Int = 1
    perPage: Int = 20
  ): [Article]
}
```

Но если вы остановитесь только на аргументах `page` и `perPage`, то польза от вашей пагинации для клиентов будет ничем не лучше `limit` и `skip`. Для того, чтобы клиентское приложение могло отрисовать нормально пагинацию, ему необходимо предоставить не только сами элементы списка, но и дополнительные метаданные как минимум с общим кол-вом страниц и записей. Для метаданных пагинации можно завести следующий общий тип `PaginationInfo`:

```graphql
type PaginationInfo {
  # Total number of pages
  pageCount: Int

  # Total number of items
  itemCount: Int

  # Current page number
  currentPage: Int!

  # Number of items per page
  perPage: Int!

  # When paginating forwards, are there more items?
  hasNextPage: Boolean

  # When paginating backwards, are there more items?
  hasPreviousPage: Boolean
}
```

В случае предоставления мета-данных для пагинации мы уже не можем взять просто и вернуть массив найденых элементов. Нам необходимо будет завести новый тип `ArticlePagination`. И вот здесь опять появляется повод к выработке стандарта:

```graphql
type Query {
  articles(
    page: Int = 1
    perPage: Int = 20
  ): ArticlePagination
}

type ArticlePagination {
  # Array of objects.
  items: [User]
  
  # Information to aid in pagination.
  pageInfo: PaginationInfo!
}
```

У `ArticlePagination` должно быть как минимум два поля:

- `items` — массив элементов
- `pageInfo` — объект с мета-данными пагинации `pageCount`, `itemCount`, `currentPage`, `perPage`

<div class="design-rule">
Для пагинации используйте аргументы `page`, `perPage` и возвращайте output-тип с полями `items` с массивом элементов и `pageInfo` с мета-данными для удобной отрисовки страниц на клиенте.
</div>

### Бесконечные списки

У пагинации есть недостаток, когда добавляются или удаляются элементы, то при переходе на следующую страницу вы можете столкнуться с проблемами:

- under-fetching — это когда в начале списка удаляется элемент, и при переходе на следующую страницу клиент пропускает запись, которая "убежала" на предыдущую страницу
- over-fetching — это когда добавляются новые записи в начало списка, и при переходе на следующую страницу клиент повторно видит записи которые были на предыдущей страницы

Для решения этой проблемы Facebook разработал спецификацию [Relay Cursor Connections Specification](https://facebook.github.io/relay/graphql/connections.htm). Она идеально подходит для создания бесконечных (infinite scroll) списков. А коль есть спецификация, то значит есть некий стандарт которому может следовать команда разработчиков и не изобретать велосипеды.

<div class="design-rule">
Для бесконечных списков (infinite scroll) используйте [Relay Cursor Connections Specification](https://facebook.github.io/relay/graphql/connections.htm).
</div>

## 6. Правила Мутаций

Больше всего бардака разводят в Мутациях. Внимательно прочитайте следующие правила, которые позволят вам сделать ваше АПИ сухим, чистым и удобным.

### Используйте Namespace-типы для мутаций

В большенстве GraphQL-схем страшно заглядывать в мутации. На АПИ среднего размера кол-во мутаций может легко переваливать за 50-100 штук, и это все на одном уровне. Ковыряться и искать нужную операцию в таком списке достаточно сложно.

Shopify рекомендует придерживаться такого именования для мутаций `collection<Action>`. В списке это позволяет хоть как-то сгрупировать операции над одним ресурсом. Кто-то противник такого подхода, и форсит использование `<action>Collection`.

В любом случае есть способ получше – используйте Namespace-типы. Это такие типы которые содержат в себе набор операций над одним ресурсом. Если представить путь запроса в dot-нотации, то выглядит он так `Mutation.<collection>.<action>`.

В NodeJS это делается достаточно легко. Я приведу несколько примеров с использованием разных библиотек:

Стандартная имплементация с пакетом `graphql`:

```js
// Create Namespace type for Article mutations
const ArticleMutations = new GraphQLObjectType({
  name: 'ArticleMutations',
  fields: () => {
    like: { type: GraphQLBoolean, resolve: () => { /* resolver code */ } },
    unlike: { type: GraphQLBoolean, resolve: () => { /* resolver code */ } },
  },
});

// Add `article` to regular mutation type with small magic
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => {
    article: {
      type: ArticleMutations,
      resolve: () => ({}), // ✨✨✨ magic! which allows to proceed call of sub-methods
    }
  },
});
```

С помощью пакета `graphql-tools`:

```js
const typeDefs = gql`
  type ArticleMutations {
    like: Boolean
    unlike: Boolean
  }

  type Mutation {
    article: ArticleMutations
}
`;

const resolvers = {
  Mutation: {
    article: () => ({}), // ✨✨✨ magic! which allows to proceed call of sub-methods
  }
  ArticleMutations: {
    like: () => { /* resolver code */ },
    unlike: () => { /* resolver code */ },
  },
};
```

С помощью `graphql-compose`:

```js
schemaComposer.Mutation.addNestedFields({
  'article.like': { // ✨✨✨ magic! Just use dot-notation with `addNestedFields` method
    type: 'Boolean',
    resolve: () => { /* resolver code */ }
  },
  'article.unlike': {
    type: 'Boolean',
    resolve: () => { /* resolver code */ }
  },
});
```

Соответственно клиенты будут делать такие запросы к вашему АПИ:

```graphql
mutation {
  article {
    like
  }

  ### Forget about ugly mutations names!
  # artileLike
  # likeArticle
}
```

Итак правило, для избежания бардака в мутациях:

<div class="design-rule">
Используйте Namespace-типы для группировки мутаций в рамках одного ресурса!
</div>

### Разбиваем оковы CRUD

С GraphQL надо отходить от CRUD (create, read, update, delete). Если вешать все измениня на мутацию `update`, то достаточно быстро она станет массивной и тяжелой в обслуживании. Здесь речь идет не о простом редактировании полей заголовок и описание, а о "сложных" операциях.  К примеру, для публикации статей создайте мутации `publish`, `unpublish`. Необходимо добавить лайки к статье - создайте две мутации `like`, `unlike`. Помните, что потребители вашего АПИ слабо представляют себе структуру взаимосвязей ваших данных, и за что каждое поле отвечает. А набор мутаций над ресурсом быстро позволяет фронтендеру вьехать в набор возможных операций.

Да и вам в будущем будет легче отслеживать по логам, что пользователи чаще всего дергают. И оптимизировать узкие места.

<div class="design-rule">
Забудьте про CRUD – cоздавайте небольшие мутации для разных логических операций над ресурсами.
</div>

### Однотипные batch-изменения

Клиентские приложения становятся более умными и удобными. Часто пользователю предлагаются batch-операции – добавление нескольких записей, массового удаления или сортировки. Отправлять операции по одной будет накладно. Как-то агрегировать их в сложный GraphQL-запрос с несколькими мутациями, т.е. генерировать один общий запрос на клиенте - порождает кучу кода с душком.

Например: есть мутация `deleteArticle`, добавьте еще `deleteArticles`. Для того чтоб пользователь мог нащелкать несколько статей и подтвердить удаление сразу пачкой.

Но здесь самое главное без фанатизма, не надо на все подряд вешать массовые операции. Всегда руководствуйтесь здравым смыслом.

<div class="design-rule">
Рассмотрите возможность выполнения мутаций сразу над несколькими элементами (однотипные batch-изменения).
</div>

### Избегаем "общих" мутаций со слабой типизацией

К примеру ваше АПИ позволяет отправить разные письма с помощью мутации `sendEmail(type: PASSWORD_RESET, params: JSON)`. Для того чтобы выбрать шаблон, вы передаете Enum аргумент с типом письма и для него передаете какие-то параметры.

Проблема такого подхода в том, что клиент заранее точно не знает какие параметры необходимо передать для того или иного типа писем. К тому же, если в будущем проводить рефакторинг схемы, то статическая типизация нам не позволит отловить ошибки на клиенте.

Лучше разбивать мутации на несколько штук с жестким описанием аргументов. Например: `sendEmailPasswordReset(login: String!, note: String)`. При этом не забываем аргументы помечать как обязательные, если без них операция не отработает.

Также бывают ситуации, когда вы обязаны передать либо один аргумент, либо другой. К примеру, мы можем отправить письмо по сбросу пароля если укажут login или email. В таком случае мы не можем оба аргумента в нашей мутации сделать обязательными. Пользователь узнает только в рантайме, что забыл передать обязательный аргумент. Да и фронтендеру будет не сразу понятно, что надо передавать либо `login`, либо `email`. А что будет если передать оба аргумента от разных пользователей?

В таком случае просто заводится две мутации, где жестко расписаны обязательные аргументы:

- `sendResetPasswordByLogin(login: String!)`
- `sendResetPasswordByEmail(email: String!)`

Не экономьте на мутациях и старайтесь избегать слабой типизации. Поэтому правило можно сформулировать так:

<div class="design-rule">
У мутаций должны быть четко описаны все обязательные аргументы, не должно быть вариантов либо-либо.
</div>

----

- Input object. Use a single, required, unique, input object type as an argument for easier mutation execution on the client.

----

## Input

Rule #18: Only make input fields required if they're actually semantically required for the mutation to proceed.

----

Rule #20: Use stronger types for inputs (e.g. DateTime instead of String) when the format may be ambiguous and client-side validation is simple. This provides clarity and encourages clients to use stricter input controls (e.g. a date-picker widget instead of a free-text field).

----

- Mutations remain slim and readable with only a couple of top-level arguments.

- Clients can share code between their create and update forms (a common pattern) because they end up manipulating the same kind of input object.

Rule #21: Structure mutation inputs to reduce duplication, even if this requires relaxing requiredness constraints on certain fields.

```graphql
type Mutation {
  # ...
  collectionCreate(title: String!, ruleSet: CollectionRuleSetInput, image: ImageInput, description: String)
  collectionUpdate(id: ID!, title: String, ruleSet: CollectionRuleSetInput, image: ImageInput, description: String)
}

# better will be
type Mutation {
  collectionCreate(collection: CollectionInput!)
  collectionUpdate(id: ID!, collection: CollectionInput!)
}

input CollectionInput {
  title: String
  ruleSet: CollectionRuleSetInput
  image: ImageInput
  description: String
}
```

Caleb Meredith: But why? The reason is that the first style is much easier to use client-side. The client is only required to send one variable with per mutation instead of one for every argument on the mutation.

```graphql
mutation MyMutation($input: UpdatePostInput!) {
  updatePost(input: $input) { ... }
}

# vs.

mutation MyMutation($id: ID!, $newText: String, ...) {
  updatePost(id: $id, newText: $newText, ...) { ... }
}
```

For no cost besides a few extra keystrokes, nesting allows you to fully embrace GraphQL’s power to be your version-less API. Nesting gives you room on your object types to explore new schema designs as time goes on. You can easily deprecate sections of the API and add new names in a conflict free space instead of fighting to find a new name on a cluttered collision-rich object type.

Think of nesting as an investment into the future of your API. See the following for an example:

```graphql
mutation {
  createPerson(input: {
    # By nesting we have room at the top level of `input`
    # to add fields like `password`, or metadata fields like
    # `clientMutationId` for Relay. We could also deprecate
    # `person` in the future to use another top level field
    # like `partialPerson`.
    password: "qwerty"
    person: {
      id: 4
      name: "Budd Deey"
    }
  }) { ... }
  updatePerson(input: {
    # The `id` field represents who we want to update.
    id: 4
    # The `patch` field represents what we want to update.
    patch: {
      name: "Budd Deey"
    }
  }) { ... }
}
```

----

Caleb Meredith: Mutations should return payload

Just like when you design your input, nesting is a virtue for your GraphQL payload. Always create a custom object type for each of your mutations and then add any output you want as a field of that custom object type. This will allow you to add multiple outputs over time and metadata fields like clientMutationId or userErrors. Just like with inputs nesting is an investment that will pay off.

Even if you only want to return a single thing from your mutation, resist the temptation to return that one type directly. It is hard to predict the future, and if you choose to return only a single type now you remove the future possibility to add other return types or metadata to the mutation. Preemptively removing design space is not something you want to do when designing a versionless GraphQL API.

----

Rule #22: Mutations should provide user/business-level errors via a userErrors field on the mutation payload. The top-level query errors entry is reserved for client and server-level errors.

```graphql
type CollectionCreatePayload {
  userErrors: [UserError!]!
  collection: Collection
}

type UserError {
  message: String!

  # Path to input field which caused the error.
  field: [String!]
}
```

Rule #23: Most payload fields for a mutation should be nullable, unless there is really a value to return in every possible error case.

----


## Some rules from Shopify
----

To get this simplified representation, I took out all scalar fields, all field names, and all nullability information. What you're left with still looks kind of like GraphQL but lets you focus on higher level of the types and their relationships.

Rule #1: Always start with a high-level view of the objects and their relationships before you deal with specific fields.

----

The one that may have stood out to you already, and is hopefully fairly obvious, is the inclusion of the CollectionMembership type in the schema. The collection memberships table is used to represent the many-to-many relationship between products and collections. Now read that last sentence again: the relationship is between products and collections; from a semantic, business domain perspective, collection memberships have nothing to do with anything. They are an implementation detail.

Rule #2: Never expose implementation details in your API design.

----

On a closely related note, a good API does not model the user interface either. The implementation and the UI can both be used for inspiration and input into your API design, but the final driver of your decisions must always be the business domain.

Even more importantly, existing REST API choices should not necessarily be copied. The design principles behind REST and GraphQL can lead to very different choices, so don't assume that what worked for your REST API is a good choice for GraphQL.

Rule #3: Design your API around the business domain, not the implementation, user-interface, or legacy APIs.

----

Exposing a schema element (field, argument, type, etc) should be driven by an actual need and use case. GraphQL schemas can easily be evolved by adding elements, but changing or removing them are breaking changes and much more difficult.

Rule #4: It's easier to add fields than to remove them.

----

Rule #5: Major business-object types should always implement Node.

```graphql
interface Node {
  id: ID!
}
```

It hints to the client that this object is persisted and retrievable by the given ID, which allows the client to accurately and efficiently manage local caches and other tricks. Most of your major identifiable business objects (e.g. products, collections, etc) should implement Node.

----

Rule #6: Group closely-related fields together into subobjects.

```graphql
type Collection implements Node {
  id: ID!
  ruleSet: CollectionRuleSet
  products: [Product!]!
  title: String!
  imageId: ID
  bodyHtml: String
}

type CollectionRuleSet {
  rules: [CollectionRule!]!
  appliesDisjunctively: Bool!
}
```

----

Rule #8: Always use object references instead of ID fields.

Now we come to the imageId field. This field is a classic example of what happens when you try and apply REST designs to GraphQL. In REST APIs it's pretty common to include the IDs of other objects in your response as a way to link together those objects, but this is a major anti-pattern in GraphQL. Instead of providing an ID, and forcing the client to do another round-trip to get any information on the object, we should just include the object directly into the graph — that's what GraphQL is for after all. In REST APIs this pattern often isn't practical, since it inflates the size of the response significantly when the included objects are large. However, this works fine in GraphQL because every field must be explicitly queried or the server won't return it.

```graphql
type Collection implements Node {
  id: ID!
  title: String!
  imageId: ID # <-- BAD
  image: Image
}

type Image {
  id: ID!
}
```

----

Rule #11: Use enums for fields which can only take a specific set of values.

```graphql
type CollectionRule {
  field: CollectionRuleField!
  relation: CollectionRuleRelation!
  value: String!
}

enum CollectionRuleField {
  TAG
  TITLE
  TYPE
  INVENTORY
  PRICE
  VENDOR
}
```

----

Rule #12: The API should provide business logic, not just data. Complex calculations should be done on the server, in one place, not on the client, in many places.

This last point is a critical piece of design philosophy: the server should always be the single source of truth for any business logic. An API almost always exists to serve more than one client, and if each of those clients has to implement the same logic then you've effectively got code duplication, with all the extra work and room for error which that entails.

```graphql
type Collection implements Node {
  # ...
  hasProduct(id: ID!): Bool!
}
```

Rule #13: Provide the raw data too, even when there's business logic around it.

Clients should be able to do the business logic themselves, if they have to. You can’t predict all of the logic a client is going to want

## Caleb Meredith example API

```graphql
type Todo {
  id: ID!
  text: String
  completed: Boolean
}

schema {
  # The query types are omitted so we can focus on the mutations!
  mutation: RootMutation
}

type RootMutation {
  createTodo(input: CreateTodoInput!): CreateTodoPayload
  toggleTodoCompleted(input: ToggleTodoCompletedInput!): ToggleTodoCompletedPayload
  updateTodoText(input: UpdateTodoTextInput!): UpdateTodoTextPayload
  completeAllTodos(input: CompleteAllTodosInput!): CompleteAllTodosPayload
}

# `id` is generated by the backend, and `completed` is automatically
# set to false.
input CreateTodoInput {
  # I would nest, but there is only one field: `text`. It would not
  # be hard to make `text` nullable and deprecate the `text` field,
  # however, if in the future we decide we have more fields.
  text: String!
}

type CreateTodoPayload {
  # The todo that was created. It is nullable so that if there is
  # an error then null won’t propagate past the `todo`.
  todo: Todo
}

# We only accept the `id` and the backend will determine the new
# `completed` state of the todo. This prevents edge-cases like:
# “set the todo’s completed status to true when its completed
# status is already true” in the type system!
input ToggleTodoCompletedInput {
  id: ID!
}

type ToggleTodoCompletedPayload {
  # The updated todo. Nullable for the same reason as before.
  todo: Todo
}

# This is a specific update mutation instead of a general one, so I
# don’t nest with a `patch` field like I demonstrated earlier.
# Instead I just provide one field, `newText`, which signals intent.
input UpdateTodoTextInput {
  id: ID!
  newText: String!
}

type UpdateTodoTextPayload {
  # The updated todo. Nullable for the same reason as before.
  todo: Todo
}

input CompleteAllTodosInput {
  # This mutation does not need any fields, but we have the space for
  # input anyway in case we need it in the future.
}

type CompleteAllTodosPayload {
  # All of the todos we completed.
  todos: [Todo]
  # If we decide that in the future we want to use connections we may
  # also add a `todoConnection` field.
}
```

## Полезные ссылки

- [Shopify: Designing a GraphQL API](https://github.com/Shopify/graphql-design-tutorial/blob/master/TUTORIAL.md)
- [Designing GraphQL Mutations by Caleb Meredith](https://blog.apollographql.com/designing-graphql-mutations-e09de826ed97)

<style>
.design-rule {
  padding: 10px;
  color: #333;
  font-weight: 500;
  font-size: 1.2em;
  line-height: 1.3;
  background: #FAFAFF;
  border-left: solid 4px #BBBBFF;
}
</style>