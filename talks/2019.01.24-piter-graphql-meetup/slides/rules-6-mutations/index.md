# 6. Правила Мутаций

-----

## [Rule 6.1.](https://github.com/nodkz/conf-talks/tree/master/articles/graphql/schema-design#rule-6.1)

## Используйте Namespace-типы для группировки мутаций в рамках одного ресурса!

-----

### На АПИ среднего размера кол-во мутаций может легко переваливать за 50-100 штук

-----

## Чтоб удобней ковыряться:

- `Mutation.collection<Action>` – рекомендует Shopify
- `Mutation.<action>Collection` – рекомендуют другие
- `Mutation.<collection>.<action>` – рекомендует это правило

```diff
mutation {
-  articleLike(id: 15)
-  likeArticle(id: 15)
+  article {
+    like(id: 15)
+  }
}

```

-----

### Используйте `Namespace-тип` <br/>(группировочный тип):

```js
const typeDefs = gql`
  type Mutation {
    article: ArticleMutations
  }

  type ArticleMutations {
    like(id: Int): Boolean
    unlike(id: Int): Boolean
  }
`;

const resolvers = {
  Mutation: {
    article: () => ({}), // ✨✨✨ magic for sub-methods calling
  }
  ArticleMutations: {
    like: () => { /* resolver code */ },
    unlike: () => { /* resolver code */ },
  },
};

```

Более детально [читать здесь](https://github.com/nodkz/conf-talks/tree/master/articles/graphql/schema-design#rule-6.1)

<span class="fragment" data-code-focus="2-4" />
<span class="fragment" data-code-focus="3,6-9" />
<span class="fragment" data-code-focus="2-4,13-15" />
<span class="fragment" data-code-focus="14" />
<span class="fragment" data-code-focus="16-19" />

-----

![Photo](./namespaces.png) <!-- .element:  style="max-height: 80vh;" class="plain"  -->

-----

## [Rule 6.2.](https://github.com/nodkz/conf-talks/tree/master/articles/graphql/schema-design#rule-6.2)

## Забудьте про CRUD – cоздавайте небольшие мутации для разных логических операций над ресурсами.

-----

### Помимо CRUD, добавляейте логические операции

```diff
type ArticleMutations {
   create(...): Payload
   update(...): Payload
+  like(...): Payload
+  unlike(...): Payload
+  publish(...): Payload
+  unpublish(...): Payload
}

```

-----

### Клиент слабо понимают структуру данных и набор логических операций позволяет быстро "вьехать".

### Бэкендеру полезнее логировать конкретные операции, чем полиморфный `update`.

-----

## [Rule 6.3.](https://github.com/nodkz/conf-talks/tree/master/articles/graphql/schema-design#rule-6.3)

## Рассмотрите возможность выполнения мутаций сразу над несколькими элементами (однотипные batch-изменения).

-----

### Например, позволяем клиентам удалять несколько статей за раз через `deleteArticles`:

```diff
type ArticleMutations {
   deleteArticle(id: Int!): Payload
+  deleteArticles(ids: [Int!]!): Payload
}

```

Клиент не должен своими силами генерировать batch-запрос из `deleteArticle` на клиенте.

-----

Если GraphQL-запрос создается в рантайме (само тело запроса, а не сбор переменных) – то вы скорее всего вы делаете что-то не так.

### Вы теряете статический анализ на клиенте. <br/>Вы точно этого хотите?!

-----

## [Rule 6.4.](https://github.com/nodkz/conf-talks/tree/master/articles/graphql/schema-design#rule-6.4)

## У мутаций должны быть четко описаны все обязательные аргументы, не должно быть вариантов либо-либо.

-----

### Для сброса пароля нужно передать <br/>либо `login`, либо `email`:

```diff
type Mutation {
-  sendResetPassword(login: String, email: Email)
+  sendResetPasswordByLogin(login: String!)  # login NonNull
+  sendResetPasswordByEmail(email: Email!)   # email NonNull
}

```

Не экономьте на мутациях и старайтесь избегать слабой типизации.

-----

### Более `строгая схема` и отсутствие `либо-либо` позволяют:

- Быстрее вьезжать фронтендерам в схему
- Отлавливать ошибки во время статического анализа

<br/><br/>

### Не доводите грех до рантайма! <!-- .element: class="fragment" -->

-----

## [Rule 6.5.](https://github.com/nodkz/conf-talks/tree/master/articles/graphql/schema-design#rule-6.5)

## У мутации вкладывайте все переменные в один уникальный `input` аргумент.

-----

```diff
- updatePost(id: ID!, newText: String, ...) { ... }
+ updatePost(input: UpdatePostInput!) { ... }
```

### Запихиваем все аргументы в `input`

```graphql
# 👎 Not so good – гороздо сложнее писать запрос (дубль переменных)
mutation ($id: ID!, $newText: String, ...) {
  updatePost(id: $id, newText: $newText, ...) { ... }
}

# 👍 Good
mutation ($input: UpdatePostInput!) {
  updatePost(input: $input) { ... }
}

```

-----

### Профит от единого `input` аргумента:

- легче писать GraphQL-запросы с переменными
- проще статический анализ (не надо руками собирать новый тип из разрозненных аргументов)
- можно деприкейтить поля (аргументы пока деприкейтить нельзя)
- инвестиции в будущие изменения вашего API

-----

## [Rule 6.6.](https://github.com/nodkz/conf-talks/tree/master/articles/graphql/schema-design#rule-6.6)

## Мутация должна возвращать свой уникальный Payload-тип.

-----

### Не поддавайтесь искушению вернуть результат напрямую. Только через `Payload-тип`.

```diff
type Mutation {
-  createPerson(input: ...): Person                # BAD
+  createPerson(input: ...): CreatePersonPayload   # GOOD
}

+ type CreatePersonPayload {
+   recordId: ID
+   record: Person
+   # ... любые другие поля, которые пожелаете
+ }

```

-----

### Payload-тип как результат мутации позволит в будущем легко добавлять новые поля!

-----

## [Rule 6.7.](https://github.com/nodkz/conf-talks/tree/master/articles/graphql/schema-design#rule-6.7)

## В ответе мутации возвращайте поле с типом `Query`.

-----

### Это правило бомба и ураган!

```diff
type Mutation {
  likePost(id: 1): LikePostPayload
}

type LikePostPayload {
   record: Post
+  query: Query
}

```

-----

### Это позволит клиентам за один раунд-трип,<br/> не только вызвать мутацию,

## НО и получить вагон данных для обновления своего приложения.

-----

### Если на клиенте Relay/ApolloClient, то с именованными `фрагментами` обновить половину приложения проще простого

```graphql
mutation {
  likePost(id: 1) {
    query {
      ...LastActivePostsComponent
      ...ActiveUsersComponent
    }
  }
}

```

Подробнее читайте [правило 6.7 тут](https://github.com/nodkz/conf-talks/tree/master/articles/graphql/schema-design#rule-6.7)

-----

## [Rule 6.8.](https://github.com/nodkz/conf-talks/tree/master/articles/graphql/schema-design#rule-6.8)

## Мутации должны возвращать поле `errors` с типизированными пользовательскими ошибками.

-----

### Узнать нормально про ошибку <br/>позволит поле `errors`:

```diff
type Mutation {
  likePost(id: 1): LikePostPayload
}

type LikePostPayload {
   record: Post
+  errors: [LikePostProblems!]
}

```

-----

```graphql
type LikePostPayload {
  record: Post
  errors: [LikePostProblems!]
}

```

### Ошибки возвращаем типизированные <br />со своими полями

```graphql
union LikePostProblems = SpikeProtectionProblem | PostDoesNotExistsProblem;

type PostDoesNotExistsProblem implements ProblemInterface {
  message: String!
  postId: Int!
}

type SpikeProtectionProblem implements ProblemInterface {
  message: String!
  # Timout in seconds when the next operation will be executed without errors
  wait: Int!
}

```

-----

## Про ошибки долго рассказывать

# поэтому

### Читать [статью про ошибки](https://github.com/nodkz/conf-talks/tree/master/articles/graphql/errors) и смотреть [видео](https://www.facebook.com/MoscowGraphql/videos/206572663566137/).

### И перечитать [правило 6.8](https://github.com/nodkz/conf-talks/tree/master/articles/graphql/schema-design#rule-6.8)