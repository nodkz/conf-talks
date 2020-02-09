# ApolloClient 3 <!-- .element: class="grey" -->

# EntityCache

-----

- Новая логика нормализованного стора `EntityCache`
  - Идеи и наработки взяты у Ian MacLeod (@nevir) из <https://github.com/convoyinc/apollo-cache-hermes>
    - <https://github.com/convoyinc/apollo-cache-hermes/blob/master/docs/Motivation.md>
    - <https://github.com/convoyinc/apollo-cache-hermes/blob/master/docs/Design%20Exploration.md#entities>
  - снижены косты по потреблению CPU и памяти
    - были ресурсоемкие операции записи и чтения
    - зачем нормализовывать все подряд, когда можно нормализовывать только объекты с `id` (бизнес сущности)
- Хорошая тема, чтобы выкинуть Redux
