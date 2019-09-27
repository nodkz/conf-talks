# Response Models

-----

GraphQL-ответы это дерево, и мы должны быть уверены, что имеем доступ к каждому кусочку этого дерева. Допустим наше приложение имеет следующие франменты:

```graphql
fragment UserProfile on User {
  ...SquarePic
}

fragment SquarePic on HasPic {
  lilPic: picture(width: 40) {
    ...CoreImage
  }
}

fragment CoreImage on Image {
  url
}
```

Для `Response Models` создается (генерируется) один интерфейс для каждого фрагмента:

```java
interface UserProfile extends SquarePic {
}

interface SquarePic {
  SquarePic.LilPic getLilPic();

  interface LilPic extends CoreImage {
  }
}

interface CoreImage {
  @Nullable URL getUrl();
}
```

Как вы видите используется наследование интерфейсов, чтобы представить разворачивание/развертывание фрагментов.

Такой подход позволяет включить в работу большое количество команд. Т.к. мы точно уверены, что вызываем поля из моделей, которые реально были запрошены с сервера.

К тому же, т.к. используется наследование мы можем данные из фрагмента `UserProfile` передать сразу двум компонентам:

```graphql
fragment UserProfile on User {
  ...SquarePic
}
```

```java
interface UserProfile extends SquarePic {}

Component renderProfile(UserProfile model) {
  URL url = model.getLilPic().getUrl();
  renderSquarePic(model); // <-- pass here `UserProfile`
}

Component renderSquarePic(SquarePic model) { // <-- accept `UserProfile`
  LilPic lilPic = model.getLilPic();
  Component image = renderCoreImage(lilPic);
}
```

Это позволяет избавиться от проблемы `underfetch`, т.к. все проперти теперь у вас статически типизированы согласно ваших GraphQL-запросов. Если вы не запросили поле в GraphQL-запросе, то его просто не будет в ваших интерфейсах у `Response Models`. И соответственно, на этапе анализа, линтинга или сборки приложения вы получите ошибку о том, что используете поле, которое не существует.

#### Вывод по Response Models

- ~~Опечатки (typos)~~
- ~~Отсутствие типовой безопасности (type safety)~~
- ~~Недополучения данных (underfetch)~~
- Получение лишних данных (overfetch)

Остается проблема `overfetch`, когда вы используете чужие данные из дерева наследования:

- Если в дочернем фрагменте удалили поле, то дожны пофиксить все родительские компоненты которые используют эти данные
- TODO: решение проблемы инкапсуляции.
