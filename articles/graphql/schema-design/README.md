# Дизайн GraphQL-схем

Рекомендации и правила озвученные в этой статье были выработаны за 3 года использования GraphQL как на стороне сервера (при построении схем) так и на клиентской стороне (написания GraphQL-запросов). Также в этой статье используются рекомендации и опыт Caleb Meredith (автора PostGraphQL и бывшего инженера Facebook) и иженеров Shopify.

Эта статья может поменяться в будущем, т.к. текущие правила носят рекомендательный характер и могут со временем улучшиться, измениться или вовсе стать антипаттерном. Но то что здесь написано, выстрадано временем и опытом использования кривых GraphQL-схем.

## TL;DR всех правил

- Правила именования полей и типов
  - Используйте `camelCase` для именования GraphQL-полей.
  - Используйте `UpperCamelCase` для именования GraphQL-типов.
  - Используйте `CAPITALIZED_WITH_UNDERSCORES` для именования значений ENUM-типов.

- Правила возврата данных
  - Rule #7: Always check whether list fields should be paginated or not.
  - Rule #10: Use custom scalar types when you’re exposing something with specific semantic value.
  - Rule #11: Use enums for fields which can only take a specific set of values.

- Правила по версионированию схемы
  - Rule #4: It’s easier to add fields than to remove them.

- Правила полей
  - Rule #6: Group closely-related fields together into subobjects.
  - Rule #9: Choose field names based on what makes sense, not based on the implementation or what the field is called in legacy APIs.

- Правила аргументов
  - Rule #20: Use stronger types for inputs (e.g. DateTime instead of String) when the format may be ambiguous and client-side validation is simple. This provides clarity and encourages clients to use stricter input controls (e.g. a date-picker widget instead of a free-text field).
  - Rule #18: Only make input fields required if they're actually semantically required for the mutation to proceed.

- Правила реляций между типами (relationships)
  - Rule #1: Always start with a high-level view of the objects and their relationships before you deal with specific fields.
  - Rule #8: Always use object references instead of ID fields.

- Правила мутаций
  - Rule #15: Mutating relationships is really complicated and not easily summarized into a snappy rule.
  - Rule #16: When writing separate mutations for relationships, consider whether it would be useful for the mutations to operate on multiple elements at once.
  - Rule #17: Prefix mutation names with the object they are mutating for alphabetical grouping (e.g. use `orderCancel` instead of `cancelOrder`).
  - Rule #19: Use weaker types for inputs (e.g. String instead of Email) when the format is unambiguous and client-side validation is complex. This lets the server run all non-trivial validations at once and return the errors in a single place in a single format, simplifying the client.
  - Rule #21: Structure mutation inputs to reduce duplication, even if this requires relaxing requiredness constraints on certain fields.
  - Rule #22: Mutations should provide user/business-level errors via a userErrors field on the mutation payload. The top-level query errors entry is reserved for client and server-level errors.
  - Rule #23: Most payload fields for a mutation should be nullable, unless there is really a value to return in every possible error case.

- Правила по бизнес-логике
  - Rule #2: Never expose implementation details in your API design.
  - Rule #3: Design your API around the business domain, not the implementation, user-interface, or legacy APIs.
  - Rule #5: Major business-object types should always implement Node.
  - Rule #12: The API should provide business logic, not just data. Complex calculations should be done on the server, in one place, not on the client, in many places.
  - Rule #13: Provide the raw data too, even when there’s business logic around it.
  - Rule #14: Write separate mutations for separate logical actions on a resource.

## Правила именования полей и типов

GraphQL для проверки имен полей и типов использует следующую регулярку `/[_A-Za-z][_0-9A-Za-z]*/`. Согласно нее можно использовать `camelCase`, `under_score`, `UpperCamelCase`, `CAPITALIZED_WITH_UNDERSCORES`. Слава богу `kebab-case` ни в каком виде не поддерживается.

Так что же лучше выбрать для именования?

Абстрактно можно обратиться к исследованию [Eye Tracking'а](http://www.cs.kent.edu/~jmaletic/papers/ICPC2010-CamelCaseUnderScoreClouds.pdf) по  `camelCase` и `under_score`. В этом исследовании явного фаворита не выявлено.

Коль исследования особо не помогло. Давайте будем разбираться в каждом конкретном случае.

### Именование полей

Названиями полей активнее всего пользуются потребители GraphQL-апи, т.е. наши любымые клиенты — браузеры с JavaScript и разработчики мобильных приложений. Давайте посмотрим, что чаще всего используется по их конвенции для именования полей. Ведь если клиенты дергают ваше апи, то скорее всего они будут использовать ваше именование для переменных у себя в коде. Ведь маппить (алиасить) название полей в удобный формат не шибко интересная работа.

Согласно [википедии](https://en.wikipedia.org/wiki/Naming_convention_(programming)) следующие клиентские языки (потребители GraphQL апи) придерживаются следующих конвенций по именованию переменных:

- JavaScript — `camelCase`
- Java — `camelCase`
- Swift — `camelCase`
- Kotlin — `camelCase`

Конечно каждый у себя "на кухне" может использовать `under_score`. Но в среднем по больнице  используется `camelCase`. Если найдете какое-нибудь исследование по процентовки использованию `camelCase` и `under_score` в том или ином языке программирования — дайте пожалуйста знать, очень тяжело гуглиться вся это тема. Кругом сплошной субъективизм.

А ещё, если залезть в кишки graphql и посмотреть его [IntrospectionQuery](https://github.com/graphql/graphql-js/blob/master/src/utilities/introspectionQuery.js), то он также написан используя `camelCase`.

Таким образом, чтоб удовлетворить большинство ваших клиентов по именованию полей:

```rule
Используйте `camelCase` для именования GraphQL-полей.
```

### Именование типов

А вот именование типов, в отличии от полей уже происходит немного по другому.

В самом GraphQL уже есть стандартные скалярные типы `String`, `Int`, `Boolean`, `Float`. Они именуются через `UpperCamelCase`.

Также внутренние типы GraphQL-интроспекции `__Type`, `__Field`, `__InputValue` и пр. Именуются через `UpperCamelCase` с двумя андерскорами в начале.

А еще GraphQL статический типизированный язык запросов. И из GraphQL-запросов много кто генерирует тайп-дефинишены для статического анализа кода. Так вот если посмотреть как в JS именуют сложные типы во Flowtype и TypeScript — то тут тоже обычно используется `UpperCamelCase`.

Таким образом, чтоб не быть "белой вороной", быть понятным и удобным для большинства:

```rule
Используйте `UpperCamelCase` для именования GraphQL-типов.
```

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

```rule
Используйте `CAPITALIZED_WITH_UNDERSCORES` для именования значений ENUM-типов.
```

## 

----

сортировка через массив энумов, направление сортировки зашивается в поле

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

Rule #7: Always check whether list fields should be paginated or not.

----

Rule #8: Always use object references instead of ID fields.

Now we come to the imageId field. This field is a classic example of what happens when you try and apply REST designs to GraphQL. In REST APIs it's pretty common to include the IDs of other objects in your response as a way to link together those objects, but this is a major anti-pattern in GraphQL. Instead of providing an ID, and forcing the client to do another round-trip to get any information on the object, we should just include the object directly into the graph - that's what GraphQL is for after all. In REST APIs this pattern often isn't practical, since it inflates the size of the response significantly when the included objects are large. However, this works fine in GraphQL because every field must be explicitly queried or the server won't return it.

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

Rule #9: Choose field names based on what makes sense, not based on the implementation or what the field is called in legacy APIs.

```graphql
type Collection implements Node {
  id: ID!
  bodyHtml: String
  description: String # is better name rather than bodyHtml
}
```

----

Rule #10: Use custom scalar types when you're exposing something with specific semantic value.

These provide additional context and semantic value for clients. In this case, it probably makes sense to define a custom HTML scalar for use here (and potentially elsewhere) when the string in question must be valid HTML.

```graphql
type Collection implements Node {
  id: ID!
  description: String
  description: StringHTML # is better name rather just String
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

## Mutations

----

Rule #14: Write separate mutations for separate logical actions on a resource.

Shopify: The first thing we might notice if we were to stick to just CRUD is that our update mutation quickly becomes massive, responsible not just for updating simple scalar values like title but also for performing complex actions like publishing/unpublishing, adding/removing/reordering the products in the collection, changing the rules for automatic collections, etc. This makes it hard to implement on the server and hard to reason about for the client. Instead, we can take advantage of GraphQL to split it apart into more granular, logical actions.

Caleb Meredith: Don’t be afraid of super specific mutations that correspond exactly to an update that your UI can make. Specific mutations that correspond to semantic user actions are more powerful than general mutations. This is because specific mutations are easier for a UI developer to write, they can be optimized by a backend developer, and only providing a specific subset of mutations makes it much harder for an attacker to exploit your API.



----

Rule #15: Mutating relationships is really complicated and not easily summarized into a snappy rule.

- addProducts
- removeProducts
- reorderProducts

Products we split into their own mutations, because the relationship is large, and ordered. Rules we left inline because the relationship is small, and rules are sufficiently minor to not have IDs.

Finally, you may note that we have mutations like addProducts and not addProduct. This is simply a convenience for the client, since the common use case when manipulating this relationship will be to add, remove, or reorder more than one product at a time.

Rule #16: When writing separate mutations for relationships, consider whether it would be useful for the mutations to operate on multiple elements at once.

----

Rule #17: Prefix mutation names with the object they are mutating for alphabetical grouping (e.g. use orderCancel instead of cancelOrder).

First a quick note on naming: you'll notice that we named all of our mutations in the form collection<Action> rather than the more naturally-English <action>Collection. Unfortunately, GraphQL does not provide a method for grouping or otherwise organizing mutations, so we are forced into alphabetization as a workaround. Putting the core type first ensures that all of the related mutations group together in the final list.

Caleb Meredith says: Names like createUser, likePost, updateComment, and reloadUserFeed are preferable to names like userCreate, postLike, commentUpdate, and userFeedReload.

----

- Naming. Name your mutations verb first. Then the object, or “noun,” if applicable. Use camelCase.
- Specificity. Make mutations as specific as possible. Mutations should represent semantic actions that might be taken by the user whenever possible.
- Input object. Use a single, required, unique, input object type as an argument for easier mutation execution on the client.
- Unique payload type. Use a unique payload type for each mutation and add the mutation’s output as a field to that payload type.
- Nesting. Use nesting to your advantage wherever it makes sense.

----

However, many applications have mutations that do not map directly to actions that can be performed on objects in your data model. For instance, say you were building a password reset feature into your app. To actually send that email you may have a mutation named: sendPasswordResetEmail. This mutation is more like an RPC call then a simple CRUD action on a data type.

The password reset email case is also a good use case for illustrating why you want specific mutations over general mutations. You may be tempted to create a mutation like sendEmail(type: PASSWORD_RESET) and call this mutation with all the different email types you may have. This is not a good design because it will be much more difficult to enforce the correct input in the GraphQL type system and understand what operations are available in GraphiQL.

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