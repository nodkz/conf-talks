# 5. Правила списков

-----

## [Rule 5.1.](https://github.com/nodkz/conf-talks/tree/master/articles/graphql/schema-design#rule-5.1)

## Для фильтрации списков используйте аргумент `filter` c типом Input, который содержит в себе все доступные фильтры.

-----

## [Rule 5.2.](https://github.com/nodkz/conf-talks/tree/master/articles/graphql/schema-design#rule-5.2)

## Для сортировки списков используйте аргумент `sort`, который должен быть массивом перечисляемых значений `[Enum!]`.

-----

## [Rule 5.3.](https://github.com/nodkz/conf-talks/tree/master/articles/graphql/schema-design#rule-5.3)

## Для ограничения возвращаемых элементов в списке используйте аргументы `limit` со значением по-умолчанию и `skip`.

-----

## [Rule 5.4.](https://github.com/nodkz/conf-talks/tree/master/articles/graphql/schema-design#rule-5.4)

## Для пагинации используйте аргументы `page`, `perPage` и возвращайте output-тип с полями `items` с массивом элементов и `pageInfo` с мета-данными для удобной отрисовки страниц на клиенте.

-----

## [Rule 5.5.](https://github.com/nodkz/conf-talks/tree/master/articles/graphql/schema-design#rule-5.5)

## Для бесконечных списков (infinite scroll) используйте [Relay Cursor Connections Specification](https://facebook.github.io/relay/graphql/connections.htm).

-----

-----

-----

-----

-----

-----
