## M8: Прикручивание QueryCost (DoS)

-----

### Что такое QueryCost?

-----

### QueryCost считает сложность запроса, который необходимо выполнить серверу. <!-- .element: class="orange" -->

<br/>

Считает в попугаях. Ну, или чтобы было проще понять – максимально возможное кол-во полей. <!-- .element: class="fragment" -->

-----

### Считает, исходя из <!-- .element: class="orange" -->

- полученного запроса от клиента <!-- .element: class="fragment" -->
- переданных переменных с запросом <!-- .element: class="fragment" -->
- и простой логики перемножения аргументов на вес полей или вес детей <!-- .element: class="fragment" -->

-----

### Операция выполняется после парсинга запроса, НО до вызова резолверов.

-----

### Если сложность запроса больше какого-то числа

- возвращаем ошибку клиенту
- запрос не выполняем (не запускаем `execute`)

-----

### Прикручиваем к `wrike-graphql`

- Берём пакет [`graphql-query-complexity`](https://github.com/slicknode/graphql-query-complexity)
- Создали плагин к аполло-серверу [`queryCostPlugin.ts`](https://github.com/nodkz/wrike-graphql/blob/master/src/queryCostPlugin.ts)
- И создаём функции `complexity` в полях нашей схемы (Complexity Estimators)

-----

### Добавляем функции `complexity`

- ко всем точкам входа в наш граф M4 (полям Query) <!-- .element: class="fragment" -->
- по желанию, можно добавить к мутациям <!-- .element: class="fragment" -->
- к релейшенам M7, которые возвращают списки <!-- .element: class="fragment" -->
  
-----

### Находим "проблемы" в REST API Wrike <!-- .element: class="red" -->

- плохо, что не везде есть лимиты на кол-во возвращаемых элементов

<br/><br/>

<span class="fragment">Например в `Folders` нет лимита. И чёрт его знает, сколько там может вернуться элементов, поэтому тяжело спрогнозировать сложность вложенного запроса.</span>

-----

### Как workaround <!-- .element: class="orange" -->

- если нет аргументов `limit` или `pageSize`
- то ставим `extensions: { complexity: ({ childComplexity }) => childComplexity * 10 }`

<br/><br/>

Делаем допущение, что в списках в среднем возвращается 10 элементов. <!-- .element: class="red fragment" -->

-----

### Смотрим

- `queryCostPlugin.ts`
- `schema/entrypoints/query/taskFindMany.ts`
- `schema/relations/task.ts`

-----

### Грубая оценка M8

- написали 1 плагин
- добавили 55 complexity функций
- накостылили 29 workaround'ов (где нет лимитов)
- ~ `⏱ 10 часов`
