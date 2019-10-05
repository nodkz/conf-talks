# 3. Response Models

-----

## Основа в `Response Models` это генерация моделей из GraphQL-запроса

-----

### GraphQL-ответы это дерево, и мы должны быть уверены, что имеем доступ к каждому кусочку этого дерева.

-----

## TypeDefinitions = <br/>f(<span class="green">GraphQL_Schema</span>, <span class="orange">GraphQL_query</span>)

<h3 class="fragment">Берется <span class="green">интроспекция схемы с сервера</span></h3>

<h3 class="fragment"> и по ней определяются типы для запрашиваемых <span class="orange">полей в запросе</span>.</h3>

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

#### SDL c сервера

```graphql
type Image {
  url: String
  size: Int!
}

```

#### GraphQL-фрагмент

```graphql
fragment CoreImage on Image {
  url
}

```

#### Сгенерированный тайп дефинишн

```typescript
export interface CoreImageFragment {
  url: string | null;
}

```

#### Компонента

```typescript
function CoreImage(props: CoreImageFragment) {
  // your code
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
export interface SquarePicFragment {
  lilPic: { size: number } & CoreImageFragment;
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
export interface UserProfileFragment extends SquarePicFragment {
  nickname: string | null;
  // lilPic: { size: number } & CoreImageFragment; <-- через extends
}

```

-----

#### В итоге имеем такие сгенерированные дефинишены

```typescript
export interface CoreImageFragment {
  url: string | null;
}

export interface SquarePicFragment {
  lilPic: { size: number } & CoreImageFragment;
}

export interface UserProfileFragment extends SquarePicFragment {
  nickname: string;
  // lilPic: { size: number } & CoreImageFragment; <-- через extends
}

```

- Используется пересечение типов <!-- .element: class="fragment" data-code-focus="6" -->
- Или множественное наследование <!-- .element: class="fragment" data-code-focus="9" -->

-----

### Теперь можно типизировать пропсы наших компонент:

```typescript
function CoreImage(props: CoreImageFragment) {
  return <img src={props.url} />
}

function SquarePic(props: SquarePicFragment) {
  return <CoreImage url={props.lilPic} />
}

function UserProfile(props: UserProfileFragment) {
  return <SquarePic lilPic={props.lilPic} />
}

```

-----

## Подход `Response models` позволяет включить в работу большое количество команд. <!-- .element: class="green" -->

-----

## Мы точно уверены, <!-- .element: class="green" -->

## что используем поля, <!-- .element: class="fragment" -->

## которые реально были запрошены с сервера. <!-- .element: class="fragment orange" -->

-----

## Это позволяет избавиться от проблемы `underfetch`, т.к. все проперти теперь статически типизированы согласно GraphQL-запросу.

-----

## Вывод по Response Models

- ~~Опечатки (typos)~~ <!-- .element: class="fragment green" -->
- ~~Отсутствие типовой безопасности (type safety)~~ <!-- .element: class="fragment green" -->
- ~~Недополучения данных (underfetch)~~ <!-- .element: class="fragment green" -->
- Получение лишних данных (overfetch) <!-- .element: class="fragment red" -->

-----

## Остается проблема `overfetch`, когда вы используете чужие данные из дерева наследования

-----

```typescript
fragment CoreImage on Image {
  url
  size
}

function CoreImage(props: CoreImageFragment) {
  return <img src={props.url} alt={props.size} />
}

```

<hr />

```typescript
fragment UserProfile on User {
  nickname
  avatar {
    ...SquarePic
  }
}

function UserProfile(props: UserProfileFragment) {
  return (
    <div>
      <CoreImage {...props.avatar} />
      Size: {props.avatar.size}
    </div>
  );
}

```

<span class="fragment" data-code-focus="3" data-code-block="1" />
<span class="fragment" data-code-focus="12" data-code-block="2" />

-----

## Если в дочернем фрагменте удалили поле, то дожны пофиксить все родительские компоненты, которые используют эти данные.

Решение проблемы – инкапсуляция. <!-- .element: class="fragment green" -->
