# Что такое GraphQL?

![GraphQL](../assets/logo/graphql.png) <!-- .element: style="width: 200px; text-align: center;" class="plain" -->

-----

## GraphQL — это <!-- .element: class="red" -->

- не база данных
- не для передачи бинарных данных
- не только под NodeJS
- не только по HTTP

-----

### GraphQL — это <!-- .element: class="orange" -->

### отличная альтернатива REST API, Swagger

-----

#### Official description  <!-- .element: class="gray" -->

## GraphQL – это <br/>язык запросов к вашему API <!-- .element: class="green" -->

-----

#### Unofficial description <!-- .element: class="gray" -->

### GraphQL – это набор функций со статически типизированными аргументами и результатом. <!-- .element: class="orange" -->

### Где на полученном результате, можно сразу вызывать вложенные функции.

-----

## У GraphQL есть интроспекция <!-- .element: class="orange" -->

### через неё вы можете узнать <br/>о схеме данных на сервере

-----

### <span class="orange">Сервер через интроспекцию рассказывает о своих возможностях,</span> <br/><br/><span class="green">а клиент через GraphQL-запрос – о своих потребностях</span>

-----

### IDE в браузере использует интроспекцию

[![GraphQL Query](./graphql-query.png) <!-- .element: class="plain" -->](https://graphql-compose.herokuapp.com/northwind/?query=%7B%0A%20%20viewer%20%7B%0A%20%20%20%20%23%20%D0%93%D0%B8%D0%B1%D0%BA%D0%BE%D1%81%D1%82%D1%8C%20%D0%B0%D0%B3%D1%80%D1%83%D0%BC%D0%B5%D0%BD%D0%B5%D0%BD%D1%82%D0%BE%D0%B2%0A%20%20%20%20customer%28filter%3A%20%7BcustomerID%3A%20%22AROUT%22%7D%29%20%7B%0A%20%20%20%20%20%20%23%20%D0%92%D1%8B%D0%B1%D0%BE%D1%80%20%D0%BF%D0%BE%D0%BB%D0%B5%D0%B9%20%D0%B2%20%D0%BE%D1%82%D0%B2%D0%B5%D1%82%D0%B5%0A%20%20%20%20%20%20customerID%0A%20%20%20%20%20%20companyName%0A%20%20%20%20%20%20%23%20%D0%92%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%BD%D1%8B%D0%B5%20%D0%B7%D0%B0%D0%BF%D1%80%D0%BE%D1%81%D1%8B%0A%20%20%20%20%20%20%23%20%D0%9E%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D0%B5%20%D1%81%D0%B2%D1%8F%D0%B7%D0%B5%D0%B9%20%D0%BC%D0%B5%D0%B6%D0%B4%D1%83%20%D1%80%D0%B5%D1%81%D1%83%D1%80%D1%81%D0%B0%D0%BC%D0%B8%2F%D0%BC%D0%BE%D0%B4%D0%B5%D0%BB%D1%8F%D0%BC%D0%B8%0A%20%20%20%20%20%20orderList%28limit%3A%203%2C%20skip%3A%2010%29%20%7B%0A%20%20%20%20%20%20%20%20%23%20%D0%A4%D1%80%D0%B0%D0%B3%D0%BC%D0%B5%D0%BD%D1%82%D1%8B%20%28%D0%B4%D0%BB%D1%8F%20%D0%BA%D0%BE%D0%BC%D0%BF%D0%BE%D0%BD%D0%B5%D0%BD%D1%82%D0%BD%D0%BE%D0%B3%D0%BE%20%D0%BF%D0%BE%D0%B4%D1%85%D0%BE%D0%B4%D0%B0%29%0A%20%20%20%20%20%20%20%20...OrderData%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%20%20%23%20%D0%97%D0%B0%D0%BF%D1%80%D0%BE%D1%81%D0%B8%D1%82%D1%8C%20%D0%BD%D0%B5%D1%81%D0%BA%D0%BE%D0%BB%D1%8C%D0%BA%D0%BE%20%D1%80%D0%B5%D1%81%D1%83%D1%80%D1%81%D0%BE%D0%B2%20%D0%B2%20%D0%BE%D0%B4%D0%BD%D0%BE%D0%BC%20%D0%B7%D0%B0%D0%BF%D1%80%D0%BE%D1%81%D0%B5%0A%20%20%20%20%23%20%D0%93%D0%B8%D0%B1%D0%BA%D0%BE%D1%81%D1%82%D1%8C%20%D0%B0%D0%B3%D1%80%D1%83%D0%BC%D0%B5%D0%BD%D0%B5%D0%BD%D1%82%D0%BE%D0%B2%0A%20%20%20%20order1%3A%20order%28filter%3A%20%7BorderID%3A%2011001%7D%29%20%7B%0A%20%20%20%20%20%20%23%20%D0%A4%D1%80%D0%B0%D0%B3%D0%BC%D0%B5%D0%BD%D1%82%D1%8B%20%28%D0%B4%D0%BB%D1%8F%20%D0%BA%D0%BE%D0%BC%D0%BF%D0%BE%D0%BD%D0%B5%D0%BD%D1%82%D0%BD%D0%BE%D0%B3%D0%BE%20%D0%BF%D0%BE%D0%B4%D1%85%D0%BE%D0%B4%D0%B0%29%0A%20%20%20%20%20%20...OrderData%0A%20%20%20%20%7D%0A%20%20%20%20%23%20%D0%97%D0%B0%D0%BF%D1%80%D0%BE%D1%81%D0%B8%D1%82%D1%8C%20%D0%BD%D0%B5%D1%81%D0%BA%D0%BE%D0%BB%D1%8C%D0%BA%D0%BE%20%D1%80%D0%B5%D1%81%D1%83%D1%80%D1%81%D0%BE%D0%B2%20%D0%B2%20%D0%BE%D0%B4%D0%BD%D0%BE%D0%BC%20%D0%B7%D0%B0%D0%BF%D1%80%D0%BE%D1%81%D0%B5%0A%20%20%20%20%23%20%D0%93%D0%B8%D0%B1%D0%BA%D0%BE%D1%81%D1%82%D1%8C%20%D0%B0%D0%B3%D1%80%D1%83%D0%BC%D0%B5%D0%BD%D0%B5%D0%BD%D1%82%D0%BE%D0%B2%0A%20%20%20%20order2%3A%20order%28filter%3A%20%7BorderID%3A%2011002%7D%29%20%7B%0A%20%20%20%20%20%20%23%20%D0%A4%D1%80%D0%B0%D0%B3%D0%BC%D0%B5%D0%BD%D1%82%D1%8B%20%28%D0%B4%D0%BB%D1%8F%20%D0%BA%D0%BE%D0%BC%D0%BF%D0%BE%D0%BD%D0%B5%D0%BD%D1%82%D0%BD%D0%BE%D0%B3%D0%BE%20%D0%BF%D0%BE%D0%B4%D1%85%D0%BE%D0%B4%D0%B0%29%0A%20%20%20%20%20%20...OrderData%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0A%0A%23%20%D0%A4%D1%80%D0%B0%D0%B3%D0%BC%D0%B5%D0%BD%D1%82%D1%8B%20%28%D0%B4%D0%BB%D1%8F%20%D0%BA%D0%BE%D0%BC%D0%BF%D0%BE%D0%BD%D0%B5%D0%BD%D1%82%D0%BD%D0%BE%D0%B3%D0%BE%20%D0%BF%D0%BE%D0%B4%D1%85%D0%BE%D0%B4%D0%B0%29%0Afragment%20OrderData%20on%20Order%20%7B%0A%20%20%23%20%D0%92%D1%8B%D0%B1%D0%BE%D1%80%20%D0%BF%D0%BE%D0%BB%D0%B5%D0%B9%20%D0%B2%20%D0%BE%D1%82%D0%B2%D0%B5%D1%82%D0%B5%0A%20%20orderID%0A%20%20orderDate%0A%20%20freight%0A%7D)

-----

<iframe src="https://graphql-compose.herokuapp.com/northwind/?query=%7B%0A%20%20viewer%20%7B%0A%20%20%20%20%23%20%D0%93%D0%B8%D0%B1%D0%BA%D0%BE%D1%81%D1%82%D1%8C%20%D0%B0%D0%B3%D1%80%D1%83%D0%BC%D0%B5%D0%BD%D0%B5%D0%BD%D1%82%D0%BE%D0%B2%0A%20%20%20%20customer%28filter%3A%20%7BcustomerID%3A%20%22AROUT%22%7D%29%20%7B%0A%20%20%20%20%20%20%23%20%D0%92%D1%8B%D0%B1%D0%BE%D1%80%20%D0%BF%D0%BE%D0%BB%D0%B5%D0%B9%20%D0%B2%20%D0%BE%D1%82%D0%B2%D0%B5%D1%82%D0%B5%0A%20%20%20%20%20%20customerID%0A%20%20%20%20%20%20companyName%0A%20%20%20%20%20%20%23%20%D0%92%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%BD%D1%8B%D0%B5%20%D0%B7%D0%B0%D0%BF%D1%80%D0%BE%D1%81%D1%8B%0A%20%20%20%20%20%20%23%20%D0%9E%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D0%B5%20%D1%81%D0%B2%D1%8F%D0%B7%D0%B5%D0%B9%20%D0%BC%D0%B5%D0%B6%D0%B4%D1%83%20%D1%80%D0%B5%D1%81%D1%83%D1%80%D1%81%D0%B0%D0%BC%D0%B8%2F%D0%BC%D0%BE%D0%B4%D0%B5%D0%BB%D1%8F%D0%BC%D0%B8%0A%20%20%20%20%20%20orderList%28limit%3A%203%2C%20skip%3A%2010%29%20%7B%0A%20%20%20%20%20%20%20%20%23%20%D0%A4%D1%80%D0%B0%D0%B3%D0%BC%D0%B5%D0%BD%D1%82%D1%8B%20%28%D0%B4%D0%BB%D1%8F%20%D0%BA%D0%BE%D0%BC%D0%BF%D0%BE%D0%BD%D0%B5%D0%BD%D1%82%D0%BD%D0%BE%D0%B3%D0%BE%20%D0%BF%D0%BE%D0%B4%D1%85%D0%BE%D0%B4%D0%B0%29%0A%20%20%20%20%20%20%20%20...OrderData%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%20%20%23%20%D0%97%D0%B0%D0%BF%D1%80%D0%BE%D1%81%D0%B8%D1%82%D1%8C%20%D0%BD%D0%B5%D1%81%D0%BA%D0%BE%D0%BB%D1%8C%D0%BA%D0%BE%20%D1%80%D0%B5%D1%81%D1%83%D1%80%D1%81%D0%BE%D0%B2%20%D0%B2%20%D0%BE%D0%B4%D0%BD%D0%BE%D0%BC%20%D0%B7%D0%B0%D0%BF%D1%80%D0%BE%D1%81%D0%B5%0A%20%20%20%20%23%20%D0%93%D0%B8%D0%B1%D0%BA%D0%BE%D1%81%D1%82%D1%8C%20%D0%B0%D0%B3%D1%80%D1%83%D0%BC%D0%B5%D0%BD%D0%B5%D0%BD%D1%82%D0%BE%D0%B2%0A%20%20%20%20order1%3A%20order%28filter%3A%20%7BorderID%3A%2011001%7D%29%20%7B%0A%20%20%20%20%20%20%23%20%D0%A4%D1%80%D0%B0%D0%B3%D0%BC%D0%B5%D0%BD%D1%82%D1%8B%20%28%D0%B4%D0%BB%D1%8F%20%D0%BA%D0%BE%D0%BC%D0%BF%D0%BE%D0%BD%D0%B5%D0%BD%D1%82%D0%BD%D0%BE%D0%B3%D0%BE%20%D0%BF%D0%BE%D0%B4%D1%85%D0%BE%D0%B4%D0%B0%29%0A%20%20%20%20%20%20...OrderData%0A%20%20%20%20%7D%0A%20%20%20%20%23%20%D0%97%D0%B0%D0%BF%D1%80%D0%BE%D1%81%D0%B8%D1%82%D1%8C%20%D0%BD%D0%B5%D1%81%D0%BA%D0%BE%D0%BB%D1%8C%D0%BA%D0%BE%20%D1%80%D0%B5%D1%81%D1%83%D1%80%D1%81%D0%BE%D0%B2%20%D0%B2%20%D0%BE%D0%B4%D0%BD%D0%BE%D0%BC%20%D0%B7%D0%B0%D0%BF%D1%80%D0%BE%D1%81%D0%B5%0A%20%20%20%20%23%20%D0%93%D0%B8%D0%B1%D0%BA%D0%BE%D1%81%D1%82%D1%8C%20%D0%B0%D0%B3%D1%80%D1%83%D0%BC%D0%B5%D0%BD%D0%B5%D0%BD%D1%82%D0%BE%D0%B2%0A%20%20%20%20order2%3A%20order%28filter%3A%20%7BorderID%3A%2011002%7D%29%20%7B%0A%20%20%20%20%20%20%23%20%D0%A4%D1%80%D0%B0%D0%B3%D0%BC%D0%B5%D0%BD%D1%82%D1%8B%20%28%D0%B4%D0%BB%D1%8F%20%D0%BA%D0%BE%D0%BC%D0%BF%D0%BE%D0%BD%D0%B5%D0%BD%D1%82%D0%BD%D0%BE%D0%B3%D0%BE%20%D0%BF%D0%BE%D0%B4%D1%85%D0%BE%D0%B4%D0%B0%29%0A%20%20%20%20%20%20...OrderData%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0A%0A%23%20%D0%A4%D1%80%D0%B0%D0%B3%D0%BC%D0%B5%D0%BD%D1%82%D1%8B%20%28%D0%B4%D0%BB%D1%8F%20%D0%BA%D0%BE%D0%BC%D0%BF%D0%BE%D0%BD%D0%B5%D0%BD%D1%82%D0%BD%D0%BE%D0%B3%D0%BE%20%D0%BF%D0%BE%D0%B4%D1%85%D0%BE%D0%B4%D0%B0%29%0Afragment%20OrderData%20on%20Order%20%7B%0A%20%20%23%20%D0%92%D1%8B%D0%B1%D0%BE%D1%80%20%D0%BF%D0%BE%D0%BB%D0%B5%D0%B9%20%D0%B2%20%D0%BE%D1%82%D0%B2%D0%B5%D1%82%D0%B5%0A%20%20orderID%0A%20%20orderDate%0A%20%20freight%0A%7D" width="100%" height="720px" />

-----

### С помощью GraphiQL вы можете быстро написать GraphQL-запрос и посмотреть какие данные возвращаются от сервера.

-----

<h3 class="orange">На сервере объявляете о своих <i>возможностях</i></h3>

в предоставлении данных (бэкендеры создают GraphQL схему).

![GraphQL](../assets/logo/graphql.png) <!-- .element: style="width: 200px; text-align: center;" class="plain" -->

<h3 class="green">На клиенте заявляете о своих <i>потребностях</i></h3>

в получении данных (фронтендеры пишут GraphQL запросы).
