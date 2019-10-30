# 4. Fragment Models

-----

## Основа в `Fragment Models` это генерация моделей из GraphQL-запроса плюс <span class="green">инкапсуляция</span>

-----

### `Fragment Models` отличается <br/>от `Response Models` только тем,

## что любой GraphQL-фрагмент который разворачивается, становится черной коробкой. <!-- .element: class="fragment green" -->

-----

## Т.е. вместо наследования интерфейсов, используются явные методы получения данных для вложенных фрагментов.

-----

```graphql
fragment CoreImage on Image {
  url
  size
}

fragment UserProfile on User {
  nickname
  avatar {
    size
    ...CoreImage
  }
}

```

```typescript
export interface CoreImage {
  url: string | null;
}

export interface UserProfile {
  nickname: string;
  avatar: {
    size: number;
    _asCoreImage(): CoreImage
  }
}

```

<span class="fragment" data-code-focus="9" data-code-block="1" />
<span class="fragment" data-code-focus="8" data-code-block="2" />
<span class="fragment" data-code-focus="10" data-code-block="1" />
<span class="fragment" data-code-focus="9" data-code-block="2" />

Note:
<!-- ```graphql
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
``` -->

-----

## Под каждый вложенный фрагмент есть метод, который возвращает только его данные.

<!-- TODO: нужен пример на компонентах -->

-----

### Пример на React + Relay

```jsx
function UserProfile({ user }: Props) {
  return <b>{user.nickname} ({user.avatar.size})</b>;
}

export default createFragmentContainer(UserProfile, {
  user: graphql`
    fragment UserProfile_user on User {
      nickname
      avatar {
        size
        ...CoreImage
      }
    }
  `,
});

```

<span class="fragment" data-code-focus="1,5" data-code-block="1" />

-----

## Вывод по Fragment Models

- ~~Опечатки (typos)~~ <!-- .element: class="fragment green" -->
- ~~Отсутствие типовой безопасности (type safety)~~ <!-- .element: class="fragment green" -->
- ~~Недополучения данных (underfetch)~~ <!-- .element: class="fragment green" -->
- ~~Получение лишних данных (overfetch)~~ <!-- .element: class="fragment green" -->

-----

## Вы в своей компоненте, перестаете видеть "чужие" данные из соседней компоненты. <!-- .element: class="green" -->

-----

## Теперь вы спокойно можете удалять поля из своего фрагмента,

## зная, что кроме вас их никто не может использовать вверх по дереву. <!-- .element: class="fragment orange" -->

-----

### В общем, как понимаете, с Fragment Models

## <br/>И басқарма сыты и қызметкерлер целы! <!-- .element: class="green" -->

# <br/> 👍
