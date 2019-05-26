
# GraphQL

# Фрагменты <!-- .element: class="green" -->

-----

### Что такое <span class="orange">GraphQL-типы</span> в терминах фронтендера?

### Это компоненты (виджеты) <!-- .element: class="fragment green" -->

<span class="fragment">К примеру, графкуэльный тип `User` может быть представлен на фронтенде 3 компонентами:
<br/>
`UserProfile`, `UserAvatar`, `UserKarmaWithName`</span>

-----

### Что такое <span class="green">GraphQL-фрагмент</span> в терминах фронтендера?

<h3 class="fragment">Это запрос нужных полей на <span class="orange">GraphQL-типе</span> для отображения реакт-компоненты</h3>

-----

### `UserProfile`

```graphql
fragment UserProfile on User {
  name
  regDate
  city
}

```

### `UserAvatar`

```graphql
fragment UserAvatar on User {
  avatar(w: 400, h: 400)
  nickname
}

```

<br/>

Тип `User` имеет кучу полей, и фрагмент — это именованный набор только тех полей, которые вам нужны в Компоненте.

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

## Ваши реакт <span class="orange">компоненты</span> должны быть обернуты в <span class="green">фрагменты</span>.

## <span class="green">Они</span> не дергают данные напрямую с сервера, они просто описывают необходимый набор данных <span class="orange">для компоненты</span>

-----

#### В итоге запрос пойдет через `<Query />` в таком виде

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

### Комбинация <span class="green">Фрагментов</span>, как комбинация <span class="orange">Компонентов</span>

<img width="1255" alt="Screen Shot 2019-05-06 at 1 14 13 AM" src="https://user-images.githubusercontent.com/1946920/57199042-4f728f80-6f9c-11e9-9123-13a3ee7b282a.png">

Image created by @sgwilym

-----

## Ломаем RESTовика в себе <!-- .element: class="green" -->

- Запрос должен быть составным и собираться снизу вверх <!-- .element: class="fragment" -->

- Накидали компонентов, собрали с них фрагменты и запрос на 90% готов <!-- .element: class="fragment" -->

- Кто-то внизу зарефакторил компоненту, чтобы отображать больше данных – вам наверху в запросе пофигу, т.к. ничего менять не надо <!-- .element: class="fragment" -->

-----

### <span class="orange">Теперь вы знаете, что</span> ☝️

## Ущербно писать запрос целиком только наверху, когда есть Фрагменты

### <span class="red fragment">Убей RESTовика в себе!</span>
