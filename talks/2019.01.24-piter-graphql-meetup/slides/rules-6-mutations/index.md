# 6. Правила Мутаций

-----

## [Rule 6.1.](https://github.com/nodkz/conf-talks/tree/master/articles/graphql/schema-design#rule-6.1)

## Используйте Namespace-типы для группировки мутаций в рамках одного ресурса!

-----

## [Rule 6.2.](https://github.com/nodkz/conf-talks/tree/master/articles/graphql/schema-design#rule-6.2)

## Забудьте про CRUD – cоздавайте небольшие мутации для разных логических операций над ресурсами.

-----

## [Rule 6.3.](https://github.com/nodkz/conf-talks/tree/master/articles/graphql/schema-design#rule-6.3)

## Рассмотрите возможность выполнения мутаций сразу над несколькими элементами (однотипные batch-изменения).

-----

## [Rule 6.4.](https://github.com/nodkz/conf-talks/tree/master/articles/graphql/schema-design#rule-6.4)

## У мутаций должны быть четко описаны все обязательные аргументы, не должно быть вариантов либо-либо.

-----

## [Rule 6.5.](https://github.com/nodkz/conf-talks/tree/master/articles/graphql/schema-design#rule-6.5)

## У мутации вкладывайте все переменные в один уникальный `input` аргумент.

-----

## [Rule 6.6.](https://github.com/nodkz/conf-talks/tree/master/articles/graphql/schema-design#rule-6.6)

## Мутация должна возвращать свой уникальный Payload-тип.

-----

## [Rule 6.7.](https://github.com/nodkz/conf-talks/tree/master/articles/graphql/schema-design#rule-6.7)

## В ответе мутации возвращайте поле с типом `Query`.

-----

## [Rule 6.8.](https://github.com/nodkz/conf-talks/tree/master/articles/graphql/schema-design#rule-6.8)

## Мутации должны возвращать в Payload'e поле `errors` с типизированными пользовательскими ошибками.

-----

-----

-----

-----

-----