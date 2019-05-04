
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

## А вот как <span class="red">жестко</span> и <span class="orange">изощренно</span>

### надо разбирать подробнее

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
    <img src="slides/01-intro/tough.jpg" alt="tough" style="min-width: 200px;" class="plain">
  </td>
</tr></table>

-----

<table><tr>
  <td>
    <img src="slides/01-intro/tough.jpg" alt="tough" style="min-width: 200px;" class="plain">
  </td>
  <td style="vertical-align: middle">
    <h3 id="-">🔥 Жестко ... </h3>
    <span class="green">Цель: декомпозировать кодовую базу и проверять статическим анализатором.</span>
    <br/><br/>Упор на качество и стабильность кода.
  </td>
</tr></table>

-----

<table><tr>
  <td style="vertical-align: middle">
    <h3 id="-">🔥 ... изощренно <small>(в рантайме)</small></h3>
    <ul>
      <li class="fragment">Распилили ответ и положили в <span class="red">нормализованный стор</span></li>
      <li class="fragment">Предоставили <span class="red">подписки</span> на изменение кусочков данных в сторе</li>
      <li class="fragment">Дали <span class="red">оптимистичные апдейты</span></li>
      <li class="fragment">Завели <span class="red">сборщик мусора</span></li>
      <li class="fragment">Предложили вручную <span class="red">изменять данные в сторе</span></li>
    </ul>
  </td><td>
    <img src="slides/01-intro/sophisticated.jpg" alt="sophisticated" style="max-height: 1000px;" class="plain">
  </td>
</tr></table>

-----

<table><tr>
  <td>
    <img src="slides/01-intro/sophisticated.jpg" alt="sophisticated" style="max-width: 350px;" class="plain">
  </td>
  <td style="vertical-align: middle">
    <h3 id="-">🔥 ... изощренно <small>(в рантайме)</small></h3>
    <span class="green">Цель: эффективно работать со стором, <br/> точечно получать уведомления на изменения интересующих данных в сторе.</span>
    <br/><br/>Упор на скорость и производительность.
  </td>
</tr></table>

-----

## Нормализированный кэш/стор

![normalized store](./normalized-store.svg) <!-- .element: style="width: 800px;" class="plain"  -->

GlobalId обычно `base64(__typename + ':' + id)`

-----

#### С другим запросом пришли обновленные данные – обновились записи в нормализованном сторе

![normalized store](./normalized-store-2.svg) <!-- .element: style="width: 800px;" class="plain"  -->

-----

### Все кто подписан на первый запрос получили обновление

![normalized store](./normalized-store-3.svg) <!-- .element: style="width: 800px;" class="plain"  -->

-----

### С нормализованным стором

- вам не важно сколько раз вам вернулись данные
- насколько глубоко они вложены в графкуэль-ответе

<span class="orange fragment">Записи хранятся максимально компактно,</span>
<span class="green fragment">всегда обновляются,</span>
<span class="red fragment">и все заинтересованные уведомляются об изменениях.</span>

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

## Ну чтож, сейчас <span class="orange">Relay</span> получит

## второе дыхание хайпа.

#### <br/>И не говорить про него в своем докладе это кащунство. <!-- .element: class="fragment orange" -->
