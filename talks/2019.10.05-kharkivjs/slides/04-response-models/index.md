# Response Models

-----

## Основа в `Response Models` это генерация моделей из GraphQL-запроса

-----

## Берется интроспекция схемы с сервера <!-- .element: class="green" -->

## и по ней определяются типы для запрашиваемых полей в запросе. <!-- .element: class="fragment" -->

-----

### GraphQL-ответы это дерево, и мы должны быть уверены, что имеем доступ к каждому кусочку этого дерева.

-----

#### Допустим наше приложение имеет следующие фрагменты:

```graphql
fragment CoreImage on Image {
  url
}

fragment SquarePic on HasPic {
  lilPic: picture(width: 40) {
    ...CoreImage
    size
  }
}

fragment UserProfile on User {
  nickname
  ...SquarePic
}

```

<span class="fragment">Важно что <code>один фрагмент</code> === <code>один компонент</code></span>

-----

## Для `Response Models` генерируется интерфейс для каждого фрагмента.

### Потом этим интерфейсом можно описать пропсы компоненты <!-- .element: class="green fragment" -->

-----

### SDL (c сервера)

```graphql
type Image {
  url: String
  size: Int!
}

```

### GraphQL-фрагмент

```graphql
fragment CoreImage on Image {
  url
}

```

### Сгенерированный код

```typescript
export interface CoreImage {
  url: string | null;
}

```

-----

### GraphQL-фрагмент

```graphql
fragment SquarePic on HasPic {
  lilPic: picture(width: 40) {
    ...CoreImage
    size
  }
}

```

### Сгенерированный код

```typescript
export interface SquarePic {
  lilPic: { size: number } & CoreImage;
}

```

-----

### GraphQL-фрагмент

```graphql
fragment UserProfile on User {
  nickname
  ...SquarePic
}

```

### Сгенерированный код

```typescript
export interface UserProfile extends SquarePic {
  nickname
  // lilPic: { size: number } & CoreImage; <-- через extends
}

```

-----

#### В итоге имеем такие сгенерированные дефинишены

```typescript
export interface CoreImage {
  url: string | null;
}

export interface SquarePic {
  lilPic: { size: number } & CoreImage;
}

export interface UserProfile extends SquarePic {
  nickname
}

```

- Используется пересечение типов <!-- .element: class="fragment" data-code-focus="6" -->
- Или множественное наследование <!-- .element: class="fragment" data-code-focus="9" -->

-----

<!-- TODO: Пример такой компоненты -->

-----

## Такой подход позволяет включить в работу большое количество команд. <!-- .element: class="green" -->

-----

## Теперь мы точно уверены, <!-- .element: class="green" -->

## что вызываем поля из моделей, <!-- .element: class="fragment" -->

## которые реально были запрошены с сервера. <!-- .element: class="fragment orange" -->

-----

## Это позволяет избавиться от проблемы `underfetch`, т.к. все проперти теперь статически типизированы согласно GraphQL-запроса.

-----

## Вывод по Response Models

- ~~Опечатки (typos)~~ <!-- .element: class="fragment green" -->
- ~~Отсутствие типовой безопасности (type safety)~~ <!-- .element: class="fragment green" -->
- ~~Недополучения данных (underfetch)~~ <!-- .element: class="fragment green" -->
- Получение лишних данных (overfetch) <!-- .element: class="fragment red" -->

-----

## Остается проблема `overfetch`, когда вы используете чужие данные из дерева наследования

-----

## Если в дочернем фрагменте удалили поле, то дожны пофиксить все родительские компоненты, которые используют эти данные.

Решение проблемы – инкапсуляция. <!-- .element: class="fragment green" -->
