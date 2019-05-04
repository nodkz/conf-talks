
# GraphQL-клиенты

-----

## GraphQL-клиенты созданы чтобы штурмовать GraphQL-сервера.

-----

## И предоставлять полученные данные

### По простому в лоб<!-- .element: class="fragment orange" -->

### или жестко и изощренно <!-- .element: class="fragment green" -->

-----

## По простому в лоб

- 🛵 Отправили запрос получили ответ <!-- .element: class="fragment" -->
- 🚜 Возможно, по строке запроса закешировали <!-- .element: class="fragment" -->
- 🚕 Возможно, во время запроса сообщали о текущем состоянии, вызывая каллбэки и хуки <!-- .element: class="fragment" -->

-----

<table><tr>
  <td style="vertical-align: middle">
    <h3 id="-">🔥 Жестко ... <small>(на этапе разработки)</small></h3>
    <ul>
      <li class="fragment">Позволяют сделать GraphQL-запросы составными из <span class="red">фрагментов</span></li>
      <li class="fragment">Генерируют <span class="red">тайп дефинишены</span> из запросов</li>
      <li class="fragment">Позволяют сделать запросы <span class="red">персистентными</span></li>
    </ul>
  </td><td>
    <img src="slides/01-intro/tough.jpg" alt="tough" style="max-height: 1000px;" class="plain">
  </td>
</tr></table>

-----

<table><tr>
  <td style="vertical-align: middle">
    <h3 id="-">🔥 ... изощренно <small>(в рантайме)</small></h3>
    <ul>
      <li class="fragment">Распилили ответ и положили в <span class="red">нормализованный стор</span></li>
      <li class="fragment">Предоставили <span class="red">подписки</span> на изменение кусочков данных в сторе</li>
      <li class="fragment">Задвинули <span class="red">оптимистичные апдейты</span></li>
      <li class="fragment">Завели <span class="red">сборщик мусора</span></li>
      <li class="fragment">Предложили вручную <span class="red">изменять данные в сторе</span></li>
    </ul>
  </td><td>
    <img src="slides/01-intro/sophisticated.jpg" alt="sophisticated" style="max-height: 1000px;" class="plain">
  </td>
</tr></table>

-----

## Какие клиенты существуют

- 🔥 `Relay` – amazing performance (complexity)
- 🔥 `ApolloClient`  – balance between features and complexity
- 🚕 `graphql-hooks` – simple for React
- 🚕 `urql` – simple for React
- 🚕 `graphql.js` – simple for vanilla JS, support fragments
- 🚜 `Lokka` – simple for vanilla JS
- 🚜 `graphql-request` – 150 LoC wrapper for fetch
- 🛵 `fetch` – Fetch API

<https://github.com/nodkz/conf-talks/tree/master/articles/graphql/clients>

-----

## Будем разбирать и сравнивать

## `ApolloClient` и `Relay`

### У них есть генераторы, нормализованный стор и поддержка фрагментов. <!-- .element: class="fragment" -->

-----

## Вообще я не хотел сравнивать

## Relay и Apollo

-----

#### Но 30 апреля 2019 Марк Цукерберг <br/>презентовал новую версию facebook.com

![fb2019](https://user-images.githubusercontent.com/1946920/57100220-2c4ba400-6d40-11e9-983f-387d8409fc8f.png) <!-- .element: style="max-width: 1000px;" class="plain"  -->

-----

## Супер быстрый и оптимизированный

[Building the New facebook.com with React, GraphQL and Relay](https://developers.facebook.com/videos/2019/building-the-new-facebookcom-with-react-graphql-and-relay/)

(40 минут)

И там действительно есть что посмотреть ☝️

-----

## Ну чтож, сейчас

## Relay получит второе дыхание хайпа.

#### <br/>И не говорить про него в своем докладе это кащунство. <!-- .element: class="fragment" -->

-----

-----

-----

-----