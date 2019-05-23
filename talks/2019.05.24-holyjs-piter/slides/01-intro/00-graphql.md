# GraphQL

![Logo](../assets/logo/graphql.png) <!-- .element: style="width: 300px;" class="plain"  -->

## стильно, модно, молодёжно

-----

## Плюсы: <!-- .element: class="green" -->

- Язык запросов для вашего API (что просите, то получаете)
- Интроспекция API из коробки (документация) <!-- .element: class="fragment" -->
- Удобная IDE в браузере (на поиграть с API) <!-- .element: class="fragment" -->
- Ваше API статически типизированное (интерпрайзненько) <!-- .element: class="fragment" -->
- Получить несколько ресурсов за 1 запрос (REST must die) <!-- .element: class="fragment" -->

-----

<iframe src="https://graphql-compose.herokuapp.com/northwind/?query=%7B%0A%20%20viewer%20%7B%0A%20%20%20%20%23%20%D0%93%D0%B8%D0%B1%D0%BA%D0%BE%D1%81%D1%82%D1%8C%20%D0%B0%D0%B3%D1%80%D1%83%D0%BC%D0%B5%D0%BD%D0%B5%D0%BD%D1%82%D0%BE%D0%B2%0A%20%20%20%20customer%28filter%3A%20%7BcustomerID%3A%20%22AROUT%22%7D%29%20%7B%0A%20%20%20%20%20%20%23%20%D0%92%D1%8B%D0%B1%D0%BE%D1%80%20%D0%BF%D0%BE%D0%BB%D0%B5%D0%B9%20%D0%B2%20%D0%BE%D1%82%D0%B2%D0%B5%D1%82%D0%B5%0A%20%20%20%20%20%20customerID%0A%20%20%20%20%20%20companyName%0A%20%20%20%20%20%20%23%20%D0%92%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%BD%D1%8B%D0%B5%20%D0%B7%D0%B0%D0%BF%D1%80%D0%BE%D1%81%D1%8B%0A%20%20%20%20%20%20%23%20%D0%9E%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D0%B5%20%D1%81%D0%B2%D1%8F%D0%B7%D0%B5%D0%B9%20%D0%BC%D0%B5%D0%B6%D0%B4%D1%83%20%D1%80%D0%B5%D1%81%D1%83%D1%80%D1%81%D0%B0%D0%BC%D0%B8%2F%D0%BC%D0%BE%D0%B4%D0%B5%D0%BB%D1%8F%D0%BC%D0%B8%0A%20%20%20%20%20%20orderList%28limit%3A%203%2C%20skip%3A%2010%29%20%7B%0A%20%20%20%20%20%20%20%20%23%20%D0%A4%D1%80%D0%B0%D0%B3%D0%BC%D0%B5%D0%BD%D1%82%D1%8B%20%28%D0%B4%D0%BB%D1%8F%20%D0%BA%D0%BE%D0%BC%D0%BF%D0%BE%D0%BD%D0%B5%D0%BD%D1%82%D0%BD%D0%BE%D0%B3%D0%BE%20%D0%BF%D0%BE%D0%B4%D1%85%D0%BE%D0%B4%D0%B0%29%0A%20%20%20%20%20%20%20%20...OrderData%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%20%20%23%20%D0%97%D0%B0%D0%BF%D1%80%D0%BE%D1%81%D0%B8%D1%82%D1%8C%20%D0%BD%D0%B5%D1%81%D0%BA%D0%BE%D0%BB%D1%8C%D0%BA%D0%BE%20%D1%80%D0%B5%D1%81%D1%83%D1%80%D1%81%D0%BE%D0%B2%20%D0%B2%20%D0%BE%D0%B4%D0%BD%D0%BE%D0%BC%20%D0%B7%D0%B0%D0%BF%D1%80%D0%BE%D1%81%D0%B5%0A%20%20%20%20%23%20%D0%93%D0%B8%D0%B1%D0%BA%D0%BE%D1%81%D1%82%D1%8C%20%D0%B0%D0%B3%D1%80%D1%83%D0%BC%D0%B5%D0%BD%D0%B5%D0%BD%D1%82%D0%BE%D0%B2%0A%20%20%20%20order1%3A%20order%28filter%3A%20%7BorderID%3A%2011001%7D%29%20%7B%0A%20%20%20%20%20%20%23%20%D0%A4%D1%80%D0%B0%D0%B3%D0%BC%D0%B5%D0%BD%D1%82%D1%8B%20%28%D0%B4%D0%BB%D1%8F%20%D0%BA%D0%BE%D0%BC%D0%BF%D0%BE%D0%BD%D0%B5%D0%BD%D1%82%D0%BD%D0%BE%D0%B3%D0%BE%20%D0%BF%D0%BE%D0%B4%D1%85%D0%BE%D0%B4%D0%B0%29%0A%20%20%20%20%20%20...OrderData%0A%20%20%20%20%7D%0A%20%20%20%20%23%20%D0%97%D0%B0%D0%BF%D1%80%D0%BE%D1%81%D0%B8%D1%82%D1%8C%20%D0%BD%D0%B5%D1%81%D0%BA%D0%BE%D0%BB%D1%8C%D0%BA%D0%BE%20%D1%80%D0%B5%D1%81%D1%83%D1%80%D1%81%D0%BE%D0%B2%20%D0%B2%20%D0%BE%D0%B4%D0%BD%D0%BE%D0%BC%20%D0%B7%D0%B0%D0%BF%D1%80%D0%BE%D1%81%D0%B5%0A%20%20%20%20%23%20%D0%93%D0%B8%D0%B1%D0%BA%D0%BE%D1%81%D1%82%D1%8C%20%D0%B0%D0%B3%D1%80%D1%83%D0%BC%D0%B5%D0%BD%D0%B5%D0%BD%D1%82%D0%BE%D0%B2%0A%20%20%20%20order2%3A%20order%28filter%3A%20%7BorderID%3A%2011002%7D%29%20%7B%0A%20%20%20%20%20%20%23%20%D0%A4%D1%80%D0%B0%D0%B3%D0%BC%D0%B5%D0%BD%D1%82%D1%8B%20%28%D0%B4%D0%BB%D1%8F%20%D0%BA%D0%BE%D0%BC%D0%BF%D0%BE%D0%BD%D0%B5%D0%BD%D1%82%D0%BD%D0%BE%D0%B3%D0%BE%20%D0%BF%D0%BE%D0%B4%D1%85%D0%BE%D0%B4%D0%B0%29%0A%20%20%20%20%20%20...OrderData%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0A%0A%23%20%D0%A4%D1%80%D0%B0%D0%B3%D0%BC%D0%B5%D0%BD%D1%82%D1%8B%20%28%D0%B4%D0%BB%D1%8F%20%D0%BA%D0%BE%D0%BC%D0%BF%D0%BE%D0%BD%D0%B5%D0%BD%D1%82%D0%BD%D0%BE%D0%B3%D0%BE%20%D0%BF%D0%BE%D0%B4%D1%85%D0%BE%D0%B4%D0%B0%29%0Afragment%20OrderData%20on%20Order%20%7B%0A%20%20%23%20%D0%92%D1%8B%D0%B1%D0%BE%D1%80%20%D0%BF%D0%BE%D0%BB%D0%B5%D0%B9%20%D0%B2%20%D0%BE%D1%82%D0%B2%D0%B5%D1%82%D0%B5%0A%20%20orderID%0A%20%20orderDate%0A%20%20freight%0A%7D" width="100%" height="720px" />

-----

## Минусы: <!-- .element: class="red" -->

- Берет и выкидывает все выработанные годами  практики <!-- .element: class="fragment" -->
  - [кеширования](https://blog.usejournal.com/caching-with-graphql-what-are-the-best-options-e161b0f20e59) <!-- .element: class="fragment" -->
  - [авторизации](https://github.com/nodkz/conf-talks/tree/master/articles/graphql/auth) <!-- .element: class="fragment" -->
- Добавляет новых задач <!-- .element:  class="fragment" style="padding-top: 25px" -->
  - [Query cost](https://github.com/slicknode/graphql-query-complexity) <!-- .element: class="fragment" -->
  - [N+1 query](https://github.com/nodkz/conf-talks/tree/master/articles/graphql/dataloader) <!-- .element: class="fragment" -->

-----

## Но так или иначе ☝️

### GraphQL — это светлое будущее любой микросервисной архитектуры <!-- .element: class="fragment orange"  -->

- Клиенты легко находят нужную информацию <!-- .element: class="fragment" -->
- Батчинг запроса (великий склеиватель) <!-- .element: class="fragment" -->
  - Параллельное обращение к микросервисам <!-- .element: class="fragment" -->
  - Последовательное обращение к микросервисам <!-- .element: class="fragment" -->
  
<span><b>Любая комбинация, которую `запросил клиент`, исходя из того, что связями `разрешил бэкендер`</b></span> <!-- .element: class="fragment green" -->