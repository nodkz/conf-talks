# Fragment Models

`Fragment Models` отличается от `Response Models` только тем, что любой GraphQL-фрагмент который разворачивается, становится черной коробкой. Т.е. вместо наследования интерфейсов, используются явные методы получения данных для вложенных фрагментов. У вас как бы в моделях нет всех тех полей, которые запрошены на нижнем уровне; у вас под каждый вложенный фрагмент есть метод, который возвращает только его данные.

```graphql
fragment UserProfile on User {
  ...AppPic
}

# Squares App fragment
fragment AppPic on HasPicture {
  squarePic: picture(style: SQUARE) {
    ...CoreImage
  }
}
```

```java
// Shared across apps
interface UserProfile {
  AppPic asAppPic();
}
interface CoreImage { ... }

// Squares App model
interface AppPic {
  SquarePic getSquarePic();

  interface SquarePic {
    CoreImage asCoreImage();
  }
}
```

#### Вывод по Fragment Models

- ~~Опечатки (typos)~~
- ~~Отсутствие типовой безопасности (type safety)~~
- ~~Недополучения данных (underfetch)~~
- ~~Получение лишних данных (overfetch)~~

Вы в своей компоненте, перестаете видить "чужие" данные из соседней компоненты. Теперь вы спокойно можете удалять поля из своего фрагмента, зная что кроме вас его никто не может использовать вверх по дереву.

TODO: need find more references and other articles about pros and cons of fragment models
