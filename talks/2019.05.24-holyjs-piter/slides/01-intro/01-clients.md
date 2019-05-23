
# GraphQL-клиенты

-----

## GraphQL-клиенты созданы чтобы штурмовать GraphQL-сервера.

-----

## И предоставлять полученные данные

### по-простому в лоб<!-- .element: class="fragment orange" -->

### или капитально и оптимально <!-- .element: class="fragment green" -->

-----

## По-простому в лоб

- 🛵 Отправили запрос получили ответ <!-- .element: class="fragment" -->
- 🚜 Возможно, по строке запроса закешировали <!-- .element: class="fragment" -->
- 🚕 Возможно, во время запроса сообщали о текущем состоянии, вызывая коллбэки и хуки <!-- .element: class="fragment" -->

-----

## А вот как <span class="red">капитально</span> и <span class="orange">оптимально</span>

### надо разбирать подробнее

-----

<table><tr>
  <td style="vertical-align: middle">
    <h3 id="-">🔥 Капитально ... <small>(на этапе разработки)</small></h3>
    <ul>
      <li class="fragment">Позволяют сделать GraphQL-запросы составными из <span class="green">фрагментов</span></li>
      <li class="fragment">Генерируют <span class="green">тайп дефинишены</span> из запросов</li>
      <li class="fragment">Позволяют сделать запросы <span class="green">персистентными</span></li>
    </ul>
  </td><td>
    <a href="slides/01-intro/tough2.jpg" target="_blank">
      <img src="slides/01-intro/tough.jpg" alt="tough" style="min-width: 200px;" class="plain">
    </a>
  </td>
</tr></table>

-----

<table><tr>
  <td>
    <a href="slides/01-intro/tough2.jpg" target="_blank">
      <img src="slides/01-intro/tough.jpg" alt="tough" style="min-width: 200px;" class="plain">
    </a>
  </td>
  <td style="vertical-align: middle">
    <h3 id="-">🔥 Капитально ... </h3>
    <span class="green">Цель: декомпозировать кодовую базу и проверять статическим анализатором.</span>
    <br/><br/>Упор на качество и стабильность кода.
  </td>
</tr></table>

-----

<table><tr>
  <td style="vertical-align: middle">
    <h3 id="-">🔥 ... оптимально <small>(в рантайме)</small></h3>
    <ul>
      <li class="fragment">Распилили ответ и положили в <span class="green">нормализованный стор</span></li>
      <li class="fragment">Предоставили <span class="green">подписки</span> на изменение кусочков данных в сторе</li>
      <li class="fragment">Дали <span class="green">оптимистичные апдейты</span></li>
      <li class="fragment">Завели <span class="green">сборщик мусора</span></li>
      <li class="fragment">Предложили вручную <span class="green">изменять данные в сторе</span></li>
    </ul>
  </td><td>
    <a href="slides/01-intro/sophisticated2.jpg" target="_blank">
      <img src="slides/01-intro/sophisticated.jpg" alt="sophisticated" style="max-height: 1000px;" class="plain">
    </a>
  </td>
</tr></table>

-----

<table><tr>
  <td>
    <a href="slides/01-intro/sophisticated2.jpg" target="_blank">
      <img src="slides/01-intro/sophisticated.jpg" alt="sophisticated" style="max-height: 1000px;" class="plain">
    </a>
  </td>
  <td style="vertical-align: middle">
    <h3 id="-">🔥 ... оптимально <small>(в рантайме)</small></h3>
    <span class="green">Цель: эффективно работать со стором, <br/> точечно получать уведомления на изменения данных в сторе.</span>
    <br/><br/>Упор на скорость и производительность.
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

### У них есть <span class="red fragment">генераторы</span>, <span class="green fragment">нормализованный стор</span> и поддержка <span class="orange fragment">фрагментов</span>.

-----

## Вообще я не хотел сравнивать

## <span class="orange">Relay</span> и <span class="apollo">Apollo</span>

-----

#### Но 30 апреля 2019 Марк Цукерберг <br/>презентовал новую версию [facebook.com](https://facebook.com)

![fb2019](https://user-images.githubusercontent.com/1946920/57100220-2c4ba400-6d40-11e9-983f-387d8409fc8f.png) <!-- .element: style="max-width: 1000px;" class="plain"  -->

-----

## Теперь facebook.com cупер быстрый и оптимизированный <!-- .element: class="fragment green" -->

[Building the New facebook.com with React, GraphQL and Relay](https://developers.facebook.com/videos/2019/building-the-new-facebookcom-with-react-graphql-and-relay/)

40 минут увлекательного видео

## Трындец одним словом, опять задрали планку фронтендерам <!-- .element: class="fragment red" -->

-----

## Ну что ж, в 2019 <span class="orange">Relay</span> получит

## второе дыхание хайпа.

#### <br/>И не говорить про него в своем докладе — это кощунство. <!-- .element: class="fragment orange" -->
