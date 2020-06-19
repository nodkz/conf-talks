# GraphQL как прокси <br/>к REST API

-----

## А реально обернуть REST API в GraphQL? <!-- .element: class="red" -->

- C авторизацией <!-- .element: class="fragment" -->
- Без проблемы N+1 (DataLoader) <!-- .element: class="fragment" -->
- С защитой от DoS (QueryCost) <!-- .element: class="fragment" -->

-----

# РЕАЛЬНО! <!-- .element: class="green" -->

-----

#### Обычно обкатку технологии принято делать на TodoMVC.

![todomvc](./todomvc.png) <!-- .element: style="max-width: 800px;" class="plain" -->

-----

## Так и поступим!

-----

### А коль я <span class="red">непростой</span> человек, <br/>то придется мне брать <br/>и <span class="red">непростое</span> Todo-приложение 😈

-----

### Возьму-ка систему управления проектами Wrike

![wrike](./wrike.png) <!-- .element: style="max-width: 1200px;" class="plain" -->

-----

## Открою их REST API <https://developers.wrike.com/api/v4>

![wrike](./wrike-api.png) <!-- .element: style="max-width: 800px;" class="plain" -->

-----

## Фи, делов-то **на пару дней!** <!-- .element: class="orange" -->

– подумал я.

-----

## И вшатал **160 часов!** <!-- .element: class="orange" -->

- только на демку, без слайдов <!-- .element: class="fragment" -->
- из-за чёртового оптимизма <!-- .element: class="fragment" -->

-----

## В REST API у Wrike оказалось: <!-- .element: class="red" -->

- 22 entity
- 87 методов

-----

## Ну, нормально так Wrike прокачал свой "TodoMVC" за 14 лет 😅

-----

## В итоге, <br/>GraphQL получился таким: <!-- .element: class="orange" -->

- 134 GraphQL-типа
- 1002 поля и аргумента
- 51 явная прямая связь между entity
- 26 неявных обратных связей

-----

## Сперва, у меня получился RestQL

## <span class="red">слабосвязный GraphQL</span>

-----

## Но потом добавил связей, <br/> которые есть в Data Domain<br/> и получил полноценный<br/> <span class="red">"волосатый" GraphQL</span>

-----

![restql-vs-graphql](./restql-vs-graphql.png) <!-- .element: style="max-width: 1100px;" class="plain" -->

-----

![restql-vs-graphql](./restql-vs-graphql.png) <!-- .element: style="max-width: 1100px; filter: saturate(500);" class="plain" -->

-----

## И теперь, у еще одного 🦄 <br/>появилось <span class="green">удобное</span> <br/>"волосатое" GraphQL апи

-----

### Например за один запрос можно получить (а-ля LEFT JOIN):

![demo-query](./demo-query.drawio.svg) <!-- .element: style="max-width: 500px; class="plain" -->

-----

<iframe src="https://graphql-wrike.herokuapp.com/?query=query%20UsersTasksWithComments%20%7B%0A%20%20contactFindMany%20%7B%0A%20%20%20%20firstName%0A%20%20%20%20lastName%0A%20%20%20%20tasksResponsible%28limit%3A2%2C%20sort%3ACREATED_DATE_ASC%29%20%7B%0A%20%20%20%20%20%20title%0A%20%20%20%20%20%20status%0A%20%20%20%20%20%20createdDate%0A%20%20%20%20%20%20comments%20%7B%20%23%20REST%20API%20does%20not%20support%20filtering%20%26%20sorting%20for%20comments%0A%20%20%20%20%20%20%20%20text%0A%20%20%20%20%20%20%20%20createdDate%0A%20%20%20%20%20%20%20%20author%20%7B%0A%20%20%20%20%20%20%20%20%20%20firstName%0A%20%20%20%20%20%20%20%20%20%20lastName%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D" width="100%" height="720px" />
