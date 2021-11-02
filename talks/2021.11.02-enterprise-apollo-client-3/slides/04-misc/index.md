# Всяко

-----

## Хью Вилсон обещал <br/>в ApolloClient 3.5, либо 3.6 завести <span class="green">поддержку фрагментной модели</span>

### Чтоб можно было большие таблицы легко обновлять. <!-- .element: class="gray fragment" -->

-----

Про фрагментную модель

<a href="https://youtu.be/0bpZiMVJh14" target="_blank"><img width="600" alt="" src="https://img.youtube.com/vi/0bpZiMVJh14/0.jpg" class="plain"></a>

<https://youtu.be/0bpZiMVJh14>

-----

### Ждем `@defer` и `@stream` уже совсем скоро.

#### Думал, что на этой презентации покажу, а нет, не успели <br>(Q4 2021 / Q1 2022) <!-- .element: class="gray" -->

-----

### graphql-helix + envelope 🔥 <!-- .element: class="orange" -->

#### @defer, @stream, @oneOf <br/>OpenTelemetry, PersistedQuery, Cache, Jit, ...

<a href="https://youtu.be/d_GBgH-L5c4" target="_blank"><img width="500" alt="" src="https://img.youtube.com/vi/d_GBgH-L5c4/0.jpg" class="plain"></a>

<https://youtu.be/d_GBgH-L5c4>

-----
## @client директива в AC3 – зло. <!-- .element: class="red" -->

Не смешивайте локальное состояние с серверным.

Оно работает, но поддерживать такой код сложно.

Reactive variables из AC3 – я бы брал из другого пакета. <!-- .element: class="red fragment" -->

## A что если завтра откажемся от AC3?! <!-- .element: class="orange fragment" -->

-----

## Что с тестированием? <!-- .element: class="orange" -->

### Делайте e2e. Дороговато, но надежно.

Cypress (sorry-cypress), playwright и др.<!-- .element: class="gray" -->

-----
## Обратите внимание

## ApolloClient3 <!-- .element: class="apollo" -->

### хорош в обычных админках, личкабах 👍 <!-- .element: class="green fragment" -->

### плох в часто обновляющихся приложениях (чаты, трейдинг) 👎 <!-- .element: class="red fragment" -->
