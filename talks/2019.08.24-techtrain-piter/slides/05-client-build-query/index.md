## Важно ☝️ <!-- .element: class="green" -->

1. удобно и безошибочно формировать GraphQL-запросы <!-- .element: class="green" -->
2. хитро слать запросы на сервер <!-- .element: class="gray" -->
3. эффективно кешировать ответы и работать с данными <!-- .element: class="gray" -->

-----

## 1. Удобно и безошибочно формировать GraphQL-запросы <!-- .element: class="green" -->

Это когда запросы собираются из GraphQL-фрагментов

-----

### Ваше приложение собирается <span class="green">снизу вверх</span>, от простых <span class="orange">компонентов</span> к более общим.

<img width="1100" alt="Screen Shot 2019-05-06 at 1 14 13 AM" src="https://user-images.githubusercontent.com/1946920/57199042-4f728f80-6f9c-11e9-9123-13a3ee7b282a.png">

Image created by @sgwilym

-----

### Каждой <span class="orange">компоненте</span> нужны данные. И эти данные можно описать через <span class="red">GraphQL-фрагменты</span>

<img width="1100" alt="Screen Shot 2019-05-06 at 1 14 13 AM" src="https://user-images.githubusercontent.com/1946920/57199042-4f728f80-6f9c-11e9-9123-13a3ee7b282a.png">

-----

<!--
import React from 'react';
import { createFragmentContainer } from 'react-relay';
import graphql from 'babel-plugin-relay/macro';
import { OrderRow_order } from './__generated__/OrderRow_order.graphql';

interface Props {
  user: UserAvatar_user;
}
-->

### Пример на React + Relay

```jsx
class UserAvatar extends React.Component<Props> {
  render() {
    const { user } = this.props;
    return <img src={user.avatar} alt={user.nickname}></img>;
  }
}

export default createFragmentContainer(UserAvatar, {
  user: graphql`
    fragment UserAvatar_user on User {
      avatar(w: 400, h: 400)
      nickname
    }
  `,
});

```

<span class="fragment" data-code-focus="10" />
<span class="fragment" data-code-focus="11-12" />
<span class="fragment" data-code-focus="3-4" />
<span class="fragment" data-code-focus="1,8" />

-----

## Ваши реакт <span class="orange">компоненты</span> должны быть обернуты в <span class="red">фрагменты</span>.

## <span class="red">Они</span> не дергают данные напрямую с сервера, они описывают необходимый набор данных <span class="orange">для компоненты</span>.

-----

### И самый верхний <span class="orange">компонент</span> должен быть обернут в <span class="red">GraphQL-запрос</span>

<img width="1100" alt="Screen Shot 2019-05-06 at 1 14 13 AM" src="https://user-images.githubusercontent.com/1946920/57199042-4f728f80-6f9c-11e9-9123-13a3ee7b282a.png">

-----

## Как ваш <span class="orange">экран</span> состоит из <span class="orange">компонент</span>...

## <span class="fragment">...так и <span class="red">GraphQL-запрос</span> состоит из <span class="red">фрагментов</span></span>

-----

#### В итоге `<Query />` будет иметь следующий вид

```graphql
query UserScreen {
  me {
    ...UserAvatar
    ...UserProfile
    lastOrder {
      ...OrderSnippet
    }
  }
  promo {
    ...Top10Goods
  }
}

# И дальше идут объявления всех ваших фрагментов
fragment UserAvatar on User {

```

<span class="fragment">`Query` – это тема ближе к Роутингу<br/>`Fragments` – ближе к Компонентам</span>

-----

### Остается открыть правильный адрес с параметрами, чтобы отобразилась страница с нужными данными

<img width="1100" alt="Screen Shot 2019-05-06 at 1 14 13 AM" src="https://user-images.githubusercontent.com/1946920/57199042-4f728f80-6f9c-11e9-9123-13a3ee7b282a.png">

-----

## Обычно <span class="red">GraphQL-запрос</span> вызывается на уровне роута

- Перешли на страницу <!-- .element: class="fragment" -->
- Взяли из роута (если надо) переменные <!-- .element: class="fragment" -->
- Передали необходимые переменные в GraphQL-запрос <!-- .element: class="fragment" -->
- Показали спиннер, пока ждем данные от сервера <!-- .element: class="fragment" -->
- Получили данные и начали пробрасывать их по компонентам сверху вниз <!-- .element: class="fragment" -->

-----

## <span class="red">GraphQL-запрос</span> мы формируем <br/><span class="orange">снизу вверх</span> через фрагменты.<br/><br/>

## <span class="red">GraphQL-ответ</span> мы пробрасываем <br/><span class="orange">сверху вниз</span> через пропсы компонент.

-----

## Так вот, навёрнутый клиент должен подогнать <span class="green">инструментарий</span>, чтобы вы не напароли чудес

-----

## <span class="green">Контролировать</span>, что правильно написаны фрагменты

-----

## <span class="green">Контролировать</span>, что фрагменты правильно вложены друг в друга

-----

## <span class="green">Собрать</span> конечный GraphQL-запрос из разных файлов и фрагментов

-----

## И сделать всё это <span class="green">на этапе билда</span> вашего приложения, <span class="red">а не в рантайме</span>

-----

### В Relay проверкой и сборкой запросов занимается <br/>`relay-compiler` <!-- .element: style="line-height: 2" -->

<br/><br/>

### В ApolloClient – <br/>`apollo client:codegen` <!-- .element: style="line-height: 2" -->
