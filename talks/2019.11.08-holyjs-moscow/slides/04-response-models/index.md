# 3. Response Models

-----

## Основа в `Response Models` это генерация моделей из GraphQL-запроса

-----

### <span class="green">GraphQL-ответы это дерево данных</span>, которое запросил клиент.

### И эти <span class="green">данные должны быть статически типизированы</span>, чтоб можно было их использовать вместо PropTypes.

-----

## <span class="apollo">TypeDefinitions</span> = <br/>f(<span class="green">GraphQL_Schema</span>, <span class="orange">GraphQL_query</span>)

<h3 class="fragment"><br/>Чтобы получить <span class="apollo">TypeDefinitions</span> для компонент</h3>

<h3 class="fragment">мы берем <span class="green">интроспекцию схемы с сервера</span></h3>

<h3 class="fragment"> и для каждого <span class="orange">поля из GraphQL-запроса</span> определяем тип данных.</h3>

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

-----

## Для `Response Models` генерируется интерфейс для каждого фрагмента.

### Потом этим интерфейсом можно описать пропсы компоненты <!-- .element: class="green fragment" -->

-----

#### SDL c сервера <!-- .element: style="line-height: 0.8" -->

```graphql
type Image {
  url: String
  size: Int!
}

```

#### GraphQL-фрагмент <!-- .element: style="line-height: 0.8" -->

```graphql
fragment CoreImage on Image {
  url
}

```

#### Сгенерированный тайп дефинишн <!-- .element: style="line-height: 0.8" -->

```typescript
export interface CoreImageFragment {
  url: string | null;
}

```

#### Компонента <!-- .element: style="line-height: 0.8" -->

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

Если фрагмент спредится на поле, <!-- .element: class="fragment orange" data-code-focus="3" data-code-block="1" -->

то используем пересечение типов <!-- .element: class="fragment orange" data-code-focus="2" data-code-block="2" -->

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

Если фрагмент спредится в типе, <!-- .element: class="fragment orange" data-code-focus="3" data-code-block="1" -->

то используем множественное наследование <!-- .element: class="fragment orange" data-code-focus="1" data-code-block="2" -->

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

<span class="fragment">Важно что <code>один фрагмент</code> === <code>один компонент</code></span>

-----

## Подход `Response models` позволяет включить в работу большое количество команд. <!-- .element: class="green" -->

-----

## Мы точно уверены, <!-- .element: class="green" -->

## что используем поля, <!-- .element: class="fragment" -->

## которые реально были запрошены с сервера. <!-- .element: class="fragment orange" -->

-----

## Это позволяет избавиться от проблемы `underfetch`, т.к. все проперти теперь статически типизированы согласно GraphQL-запросу.

-----

## Мы больше не генерируем лишнего кода из серверной схемы. Только то что запросили.

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

-----

<table>
  <tr>
    <td>
      <img src="../manager-happy-semi.png" class="plain" style="min-width: 200px" />
    </td>
    <td style="vertical-align: middle;">
      <h2>Задача: </h2>
      <h2 class="orange">Как бы не задевать соседние компоненты при рефакторинге?!</h2>
    </td>
  </tr>
</table>