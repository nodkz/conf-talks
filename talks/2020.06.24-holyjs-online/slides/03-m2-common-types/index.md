## M2: Описание общих GraphQL-типов

-----

### Описываем часто-используемые <br/>"конечные типы" (Leaf types), <br/>которые ни от кого не зависят

### `schema/types`

-----

### "Конечные типы" (Leaf types) <!-- .element: class="orange" -->

- Скаляры <!-- .element: class="fragment" -->
- Enum <!-- .element: class="fragment" -->
- Output и Input (структуры) <!-- .element: class="fragment" -->

-----

### По ходу описания `Entities (M3)` <br/>мы будем в `schema/types` <br/>докидывать необходимые `Общие типы (M2)`

<br/>

Сразу нет смысла их выискивать <br/>по всей REST API документации <!-- .element: class="fragment red" -->

-----

### Грубая оценка

- 24 Scalars
- 35 Enums
- 7 Output types
- 14 Input types
- ~ `⏱ 10 часов`

-----

### Для описания Типов я использую

### `graphql-compose`

-----

### Что такое `graphql-compose`?

- Это type registry, с возможность редактирования и клонирования типов для написания генераторов GraphQL-схем. <!-- .element: class="fragment" -->
- Это прокаченная тулза для написания GraphQL-схем с кучей сахара<!-- .element: class="fragment" -->
- Это и schema-first и code-first в одном флаконе <!-- .element: class="fragment" -->
