# GraphQL <span class="green">нужен</span>, если

-----

### GraphQL нужен, если <!-- .element: class="green" -->

- взаимодействие между бэком и фронтом <!-- .element: class="fragment" -->
- боль от мульёна микросервисов со своими эндпоинтами <!-- .element: class="fragment" -->
- у вас большие Entity и затратно таскать все 100 полей, когда нужно всего два <!-- .element: class="fragment" -->
- нужны тонкие клиенты на фронтенде <!-- .element: class="fragment" -->
- нужен статический анализ кода <!-- .element: class="fragment" -->
- вам тесно в парадигме 4 операций CRUD в RESTfull API (изменения состояния) <!-- .element: class="fragment" -->
- много разных entity (models) со связями и клиенты хотят сами собирать агрегации (а-ля LEFT JOIN) <!-- .element: class="fragment" -->

-----

## Взаимодействие между бэком и фронтом <!-- .element: class="green" -->

- GraphQL разрабатывался для удобства фронтендеров <!-- .element: class="fragment" -->
- в SPA и мобилках желательно использовать "умные стейт-менеджеры", типа Apollo Client, Relay, urql и пр., которые дико упрощают выполнение запросов, кешируют и нормализовывают данные <!-- .element: class="fragment" -->

-----

## Мульён микросервисов со своими эндпоинтами <!-- .element: class="green" -->

- Когда список ендпоинтов начинает идти на сотни, то знание о них и связях между ними можно заложить в GraphQL. <!-- .element: class="fragment" -->
- Зачем мучить бедных фронтендеров безумным пластом знаний, учить их тому как устроена наша бэкендерская кухня, которая постоянно меняется. И документация постоянно устаревает. <!-- .element: class="fragment" -->
- У GraphQL один endpoint <!-- .element: class="fragment" -->

-----

## у вас большие Entity и затратно таскать все 100 полей, когда нужно всего два (как у GitHub) <!-- .element: class="green" -->
  
- GraphQL явно требует от клиентов указывать в запросе список полей, которые необходимо вернуть <!-- .element: class="fragment" -->
- в OpenAPI, json-rpc в спецификации не заложена фильтрация возвращаемых полей <!-- .element: class="fragment" -->

-----

## Нужны тонкие клиенты на фронтенде согласно серверной схеме данных <!-- .element: class="green" -->
  
- graphql-codegen может прекрасно генерировать фетчеры данных на базе GraphQL-запросов (не путать с GraphQL-схемой). <!-- .element: class="fragment" -->
- если для OpenAPI, json-rpc генерируются полные клиенты со всеми методами, типами и полями. <!-- .element: class="fragment" -->
- то с GraphQL можно генерировать только то, что есть в GraphQL-запросах, пропуская тысячи реально неиспользуемых типов и полей. <!-- .element: class="fragment" -->
- graphql-codegen (помимо JS/TS, может в Java и С#). <!-- .element: class="fragment" -->

-----

## Нужен статический анализ кода <!-- .element: class="green" -->
  
<ul>
  <li class="fragment">
    <a href="https://www.graphql-code-generator.com/">graphql-codegen</a> генерирует typescript дефинишены согласно GraphQL-запросов (любое неправильное употребление полей можно будет отловить на билде приложения)
  </li>
  <li class="fragment">
    <a href="https://graphql-inspector.com/">graphql-inspector</a> может отлавливать breaking changes в GraphQL-схемах, валидировать GraphQL-запросы
  </li>
</ul>

-----

## Если вам тесно в парадигме 4 операций CRUD в RESTfull API <!-- .element: class="green" -->
  
- например операции "провести оплату", "приостановить подписку" и пр. достаточно плохо ложатся в CRUD (изменение состояния). <!-- .element: class="fragment" -->
- тут нужно смотреть в сторону RPC (вызов процедур) <!-- .element: class="fragment" -->
- GraphQL лучше json-rpc в следующих вещах: <!-- .element: class="fragment" -->
  - вызвать получение вложенных данных на результате выполнения родительской операции; <!-- .element: class="fragment" -->
  - удобные IDE для написания запросов и их проверки; <!-- .element: class="fragment" -->
  - побогаче туллинг кодогенерации (graphql-codegen) <!-- .element: class="fragment" -->

-----

<a href="https://youtu.be/HMTIUQPAbRs" target="_blank"><img src="https://img.youtube.com/vi/HMTIUQPAbRs/0.jpg" alt="Круглый стол: json-rpc, GraphQL, gRPC" style="width: 680px" /></a>

<https://youtu.be/HMTIUQPAbRs>

-----

### Много разных entity (models) со связями и клиенты хотят сами собирать агрегации (а-ля LEFT JOIN). <!-- .element: class="green" -->
  
- часто удобно для всяких админок и дашбордов на клиентских приложениях <!-- .element: class="fragment" -->
- написать самостоятельно сложную выборку данных из чужого сервиса достаточно просто <!-- .element: class="fragment" -->
- когда много разработчиков, нужен какой-то инструмент для хранения знаний о DataDomain, удобный язык общения, стабильная спецификация. <!-- .element: class="fragment" -->
- и даже на бэкенде сервисы могут общаются через GraphQL, если нужны сложные "управляемые" выборки <!-- .element: class="fragment" -->

-----

![voyager](./graphql-voyager.png)

[graphql-voyager](https://github.com/APIs-guru/graphql-voyager)

-----

![docs-example](./docs-example.png)

-----

![docs-example2](./docs-example2.png)
