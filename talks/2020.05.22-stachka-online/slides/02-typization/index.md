# Typization

-----

## Зачем нам статическая типизация? <!-- .element: class="orange" -->

- отлавливает некорректное использование свойств
- отлавливает некорректный вызов методов
- дает автоподстановку доступных полей

-----

## GraphQL строго типизированный <!-- .element: class="green" -->

-----

## JS тоже может быть строготипизированным <!-- .element: class="green" -->

### TypeScript 👨‍✈️👨‍✈️👨‍✈️

-----

## И было бы здорово

## генерировать тайп-дефинишены <!-- .element: class="green" -->

## для результатов GraphQL-запросов

-----

### Давайте посмотрим на простой пример на ApolloClient & React hooks

-----

### Опишем простой GraphQL-запрос

```js
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

const GET_DOGS = gql`
  query GetDogs {
    dogs {
      id
      breed
    }
  }
`;

```

<small><a href="https://www.apollographql.com/docs/react/data/queries/#executing-a-query">https://www.apollographql.com/docs/react/data/queries/#executing-a-query</a></small>

-----

```js
function Dogs() {
  const { loading, error, data } = useQuery(GET_DOGS);

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  return (
    <select name="dog">
      {data.dogs.map(dog => (
        <option key={dog.id} value={dog.breed}>
          {dog.bread}
        </option>
      ))}
    </select>
  );
}

```

<span class="fragment">Заметили ошибку?</span>
<div class="fragment" data-code-focus="11">TypeScript бы моментом её отловил.</div>

-----

## Но для этого нужно генерировать типы!

-----

### Обычно настраивают "кислый" `apollo cli`:

```bash
apollo client:codegen \
  --addTypename --target=typescript \
  --localSchemaFile=./schema.graphql \
  --includes=\"./src/**/*.{ts,tsx}\" --tagName gql \
  --watch

```

-----

#### Который сгененрирует `__generated__/GetDogs.ts`

```js
/* tslint:disable */
/* eslint-disable */

export interface GetDogs_dogs {
  __typename: "Dog";
  id: number | null;
  breed: string | null;
}

export interface GetDogs {
  dogs: GetDogs_dogs[];
}

```

-----

### А затем его надо подключить к нашему модулю

```diff
+ import { GetDogs } from './__generated__/GetDogs';

function Dogs() {
-  const { loading, error, data } = useQuery(GET_DOGS);
+  const { loading, error, data } = useQuery<GetDogs>(GET_DOGS);

  return (
    <select name="dog">
      {data.dogs.map(dog => (
        <option key={dog.id} value={dog.breed}>
          {dog.bread}
-              ^^^^^
        </option>
      ))}
    </select>

```

<div class="fragment" data-code-focus="11-12">И TypeScript подсветит ошибки <span class="gray">(их тут еще 3 штуки)</span></div>

-----

У такого подхода есть ошибки

```diff
+ import { GetDogs } from './__generated__/GetDogs';

function Dogs() {
-  const { loading, error, data } = useQuery(GET_DOGS);
+  const { loading, error, data } = useQuery<GetDogs>(GET_DOGS);
```

Импортнули не из того файла
Записали не тот тип или совсем его забыли
Поправили запрос, надо менять импорты.

-----

- Показать пример с обычным apollo-хуком
- Делаем вывод о том, что когда мы используем автотипизацию и обычные хуки мы постоянно делаем одно и то же, поэтому пусть за нас это делает инструмент
- Но это куча импортов, а хороший программист -- ленивый программист. Так что пусть машина пишет код за нас
- И этот инструмент: graphql-code-generator
