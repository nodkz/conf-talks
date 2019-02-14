## GraphQL-сервер

![Диаграмма экосистемы](./diagram-ecosystem-server.svg) <!-- .element: style="width: 90vw;" class="plain"  -->

-----

![Диаграмма работы сервера](./diagram-server.svg) <!-- .element: style="width: 90vw;" class="plain"  -->
<!-- https://drive.google.com/file/d/1G-Iu_fZdrois9NZY1-5YGWNwELJEzy6Y/view?usp=sharing -->

-----

### Каковы обычно требования к серверу?

<br />
<br />

### По некому протоколу обслуживать множество запросов от разных клиентов. <!-- .element: class="fragment" -->

<br />
<br />

<span>Это может быть `http(s)` или `websockets`, либо вообще что-то экзотическое типа `ssh`, `telnet`.</span> <!-- .element: class="fragment" -->

-----

### Что должен делать HTTP-сервер

- открыть порт и слушать http-запросы от клиентов
- вытаскивать из них GraphQL-запрос с переменными
- формировать `context` с данными текущего пользователя и глобальными ресурсами (в рамках запроса)
- откуда-то получить "сваренную" GraphQL-схему
- отправить на выполнение GraphQL-схему, запрос и `context` в пакет `graphql`
- из полученных данных от `graphql` сформировать http-ответ и отдать клиенту

-----

### По-желанию попутно сделать всякие операции, типа:

- парсинга кук
- проверки токенов
- базовая авторизация
- превращение persistent query по id в GraphQL-запрос
- логирования запросов
- кеша запросов
- отлова ошибок и отправки их в систему мониторинга.

-----

### Популярные сервера:

- [express-graphql](https://github.com/graphql/express-graphql)
- [koa-graphql](https://github.com/chentsulin/koa-graphql)
- [apollo-server@1.x.x](https://github.com/apollographql/apollo-server/tree/version-1)
- [apollo-server@2.x.x](https://github.com/apollographql/apollo-server/tree/version-2)
- [graphql-yoga](https://github.com/prisma/graphql-yoga)

<br />
<br />

TL;DR: берите `apollo-server@2.x.x`

-----

Подробнее о серверах, [читать тут](https://github.com/nodkz/conf-talks/tree/master/articles/graphql/server)
