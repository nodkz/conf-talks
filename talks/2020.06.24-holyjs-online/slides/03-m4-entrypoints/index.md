## M4: Описание точек входа в граф

-----

### Описываем входные точки

- `query`
- `mutation`
- `subscription`

-----

### За 5 лет я перепробовал кучу подходов в построении схем <!-- .element: class="orange" -->

<https://github.com/nodkz/conf-talks/tree/master/articles/graphql/schema-build-ways>

<https://youtu.be/RmGxUfmksck>

  <a href="https://www.youtube.com/watch?v=RmGxUfmksck" target="_blank"><img src="https://img.youtube.com/vi/RmGxUfmksck/0.jpg" alt="5 подходов построения GraphQL-схем (Kyiv 2019, Zlit Tech)" style="width: 380px" /></a>

-----

### И сейчас использую <br/>`graphql-compose-modules` ☝️

<br/>

Подход начала 2020 года <!-- .element: class="gray fragment" -->

-----

![_](./modules1.drawio.svg) <!-- .element: style="max-width: 800px;" class="plain" -->

TODO: улучшить графики

-----

![_](./modules2.drawio.svg) <!-- .element: style="max-width: 800px;" class="plain" -->

-----

### А еще это удобный способ работы со схемой: <!-- .element: class="green" -->

- удобно смотреть схему через файлы <!-- .element: class="fragment" -->
- легкий рефакторинг схемы <!-- .element: class="fragment" -->
- удобный код ревью <!-- .element: class="fragment" -->
- тестирование схемы по кускам <!-- .element: class="fragment" -->

-----

### Смотрим `schema/entrypoints` и `server.ts`

-----

##### По завершению этого этапа (M4) <br/>получаем `RestQL` (графкуэль без связей)

![restql-query](../02-result/restql-query.png) <!-- .element: style="max-width: 800px;" class="plain" -->

-----

### Грубая оценка M4

- 41 query + 65 mutation entrypoints
- 1034 + 1454 LoC
- ~ `⏱ 40 часов`
