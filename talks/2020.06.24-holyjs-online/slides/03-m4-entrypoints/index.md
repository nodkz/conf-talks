## M4: Описание точек входа в граф

-----

### Описываем входные точки

- `schema/query`
- `schema/mutation`
- `schema/subscription`

-----

За 5 лет я перепробовал кучу подходов в построении схем

<https://github.com/nodkz/conf-talks/tree/master/articles/graphql/schema-build-ways>

<https://youtu.be/RmGxUfmksck>

-----

### И сейчас использую `graphql-compose-modules`

![_](./modules1.drawio.svg) <!-- .element: style="max-width: 800px;" class="plain" -->

-----

![_](./modules2.drawio.svg) <!-- .element: style="max-width: 800px;" class="plain" -->

-----

### А еще это удобный способ работы со схемой: <!-- .element: class="green" -->

- удобно смотреть схему через файлы <!-- .element: class="fragment" -->
- легкий рефакторинг схемы <!-- .element: class="fragment" -->
- удобный код ревью <!-- .element: class="fragment" -->
- тестирование схемы по кускам <!-- .element: class="fragment" -->

-----

##### По завершению этого этапа (M4) <br/>получаем `RestQL` (графкуэль без связей)

![restql-query](../02-result/restql-query.png) <!-- .element: style="max-width: 800px;" class="plain" -->

-----

### Грубая оценка

- 41 query + 65 mutation entrypoints
- 1034 + 1454 LoC
- ~ `⏱ 40 часов`
