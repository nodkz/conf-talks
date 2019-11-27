# GraphQL vs REST

-----

#### Минусы REST API, даже со Swagger'ом:

- Каждый эндпоинт описывается примитивными типами, нет "сложных" типов <!-- .element: class="fragment" -->
- Нет связей; неизвестно, как оптимальнее всего запросить связанные ресурсы <!-- .element: class="fragment" -->
- Жирные ответы, если не прикрутить фильтр по полям <!-- .element: class="fragment" -->
- Нет возможности построить сложный агрегированный запрос <!-- .element: class="fragment" -->
- Частенько много сетевых запросов <!-- .element: class="fragment" -->
- Боль с вложенными агрументами <!-- .element: class="fragment" -->

-----

#### Самый жирный минус:

## С REST API фронтендеры пишут кучу бойлерплейт кода, для получения связанных данных между ресурсами. <!-- .element: class="fragment" -->

-----

## Концептуальная разница GraphQL и REST API в том,

## что логику получения связанных ресурсов перенесли с клиента на сервер. <!-- .element: class="fragment" -->

Сняли жуткий головняк с фронтендеров 👍 <!-- .element: class="fragment" -->

-----

#### Более подробнее расписано тут

- [Swagger vs GraphQL](https://github.com/nodkz/conf-talks/blob/master/articles/swagger/README.md)

-----

## Минусы GraphQL: <!-- .element: class="red" -->

- Берет и выкидывает все выработанные годами  практики <!-- .element: class="fragment" -->
  - [кеширования](https://blog.usejournal.com/caching-with-graphql-what-are-the-best-options-e161b0f20e59) <!-- .element: class="fragment" -->
  - [авторизации](https://github.com/nodkz/conf-talks/tree/master/articles/graphql/auth) <!-- .element: class="fragment" -->
- Добавляет новых задач <!-- .element:  class="fragment" style="padding-top: 25px" -->
  - [Query cost](https://github.com/slicknode/graphql-query-complexity) <!-- .element: class="fragment" -->
  - [N+1 query](https://github.com/nodkz/conf-talks/tree/master/articles/graphql/dataloader) <!-- .element: class="fragment" -->

-----

## GraphQL в эру HTTP2

Does your GraphQL replacement have:

- a type system 
- schema introspection 
- and GraphiQL-like API explorer that works out of the box with every API? 

- <https://twitter.com/southpolesteve/status/1183846300690898951>

-----

Более развернуто про HTTP2 и GraphQL:

<https://medium.com/@__xuorig__/is-graphql-still-relevant-in-an-http2-world-64964f207b8>

-----

## А еще графкуэль со своими фрагментами отлично дополняет компонентный подход!

### GraphQL-фрагменты на клиенте (HolyJS Moscow 2019)

<a href="https://www.youtube.com/watch?v=0bpZiMVJh14" target="_blank"><img src="https://img.youtube.com/vi/0bpZiMVJh14/0.jpg" alt="GraphQL-фрагменты на клиенте: История появления, ошибки использования (HolyJS Moscow 2019)" style="max-width: 480px" /></a>
