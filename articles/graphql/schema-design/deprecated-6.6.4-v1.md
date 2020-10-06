### <a name="rule-6.6.4"></a> 6.6.4. В ответе мутации возвращайте поле `errors` с типизированными пользовательскими ошибками.

**DEPRECATED! В этом правиле предлагается использовать Union-типы, но практика показала, что их тяжело создавать бэкендерам, да и фронтендерам не особо удобно ими пользоваться. Вместо этого, предлагается использовать интерфейсы.**

В резолвере можно выбросить эксепшн, и тогда ошибка улетает на глобальный уровень, но так делать нельзя по следующим причинам:

- ошибки глобального уровня используются для ошибок парсинга и других серверных ошибок
- на клиентской стороне тяжело разобрать этот массив глобальных ошибок
- клиент не знает какие ошибки могут возникнуть, они не типизированы и в схеме отсутствуют.

```diff
type Mutation {
  likePost(id: 1): LikePostPayload
}

type LikePostPayload {
   record: Post
+  errors: [LikePostProblems!]
}
```

Мутации должны возвращать пользовательские ошибки или ошибки бизнес-логики сразу в Payload'е мутации в поле `errors`. Все ошибки необходимо описать с суффиксом `Problem`. И для самой мутации завести Union-тип ошибок, где будут перечислены возможные пользовательские ошибки. Это позволит легко определять ошибки на клиентской стороне, сразу понимать что может пойти не так. И более того, позволит клиенту дозапросить дополнительные метаданные по ошибке.

Для начала, необходимо создать интерфейс для ошибок и можно объявить пару глобальных ошибок. Интерфейс необходим, чтобы можно было считать текстовое сообщение в не зависимости от того, какая ошибка вернулась. А вот каждую конкретную ошибку уже можно расширить дополнительными значениями, например в ошибке `SpikeProtectionProblem` добавлено поле `wait`:

```graphql
interface ProblemInterface {
  message: String!
}

type AccessRightProblem implements ProblemInterface {
  message: String!
}

type SpikeProtectionProblem implements ProblemInterface {
  message: String!
  # Timout in seconds when the next operation will be executed without errors
  wait: Int!
}

type PostDoesNotExistsProblem implements ProblemInterface {
  message: String!
  postId: Int!
}
```

Ну а дальше можно описать нашу мутацию `likePost` с возвратом пользовательских ошибок:

```graphql
type Mutation {
  likePost(id: Int!): LikePostPayload
}

union LikePostProblems = SpikeProtectionProblem | PostDoesNotExistsProblem;

type LikePostPayload {
  recordId: Int
  # `record` is nullable! If there is an error we may return null for Post
  record: Post
  errors: [LikePostProblems!]
}
```

Благодаря union-типу `LikePostProblems` теперь через интроспекцию фронтендеры знаю какие ошибки могут вернутся при вызове мутации `likePost`. К примеру, для такого запроса они для любого типа ошибки смогут считать название ошибки с поля `__typename`, а вот благодаря интерфейсу считать `message` из любого типа ошибки:

```graphql
mutation {
  likePost(id: 666) {
    errors {
      __typename
      ... on ProblemInterface {
        message
      }
    }
  }
}
```

А если клиенты умные, то можно запросить дополнительные поля по необходимым по ошибкам:

```graphql
mutation {
  likePost(id: 666) {
    recordId
    record {
      title
      likes
    }
    errors {
      __typename
      ... on ProblemInterface {
        message
      }
      ... on SpikeProtectionProblem {
        message
        wait
      }
      ... on PostDoesNotExistsProblem {
        message
        postId
      }
    }
  }
}
```

И получить ответ от сервера в таком виде:

```js
{
  data: {
    likePost: {
      errors: [
        {
          __typename: 'PostDoesNotExistsProblem',
          message: 'Post does not exists!',
          postId: 666,
        },
        {
          __typename: 'SpikeProtectionProblem',
          message: 'Spike protection! Please retry later!',
          wait: 20,
        },
      ],
      record: { likes: 0, title: 'Post 666' },
      recordId: 666,
    },
  },
}
```
