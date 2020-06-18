## M2: Описание общих GraphQL-типов

-----

### Описываем часто-используемые <br/>"конечные типы" (Leaf types, common types), <br/>которые ни от кого не зависят

-----

### "Конечные типы" (Leaf types) <!-- .element: class="orange" -->

- Скаляры <!-- .element: class="fragment" -->
- Enum <!-- .element: class="fragment" -->
- Output и Input (структуры) <!-- .element: class="fragment" -->

-----

### Для описания Типов я использую

### `graphql-compose`

-----

### Что такое `graphql-compose`?

- Это прокаченная тулза на NodeJS для написания <br/>GraphQL-схем с кучей сахара <!-- .element: class="fragment" -->
- Это type registry, с возможность редактирования и клонирования типов для написания генераторов <br/>GraphQL-схем. <!-- .element: class="fragment" -->
- Это и schema-first и code-first в одном флаконе <!-- .element: class="fragment" -->

-----

### Смотрим `schema/types`

-----

### Грубая оценка M2

- 24 Scalars
- 35 Enums
- 7 Output types
- 14 Input types
- ~ `⏱ 10 часов`
