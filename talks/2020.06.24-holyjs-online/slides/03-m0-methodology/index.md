# Методология построения GraphQL-прокси к REST API

-----

## <span class="orange">Практическая методология –</span> <br/>это алгоритм, набор приёмов и способов того, как достичь желаемой практической цели.

-----

- <span class="fragment">M1: Создание обёртки к REST API `vendor`</span>
- <span class="fragment">M2: Описание общих GraphQL-типов `schema/types`</span>
- <span class="fragment">M3: Описание Entity `schema/entities`</span>
- <span class="fragment">M4: Описание точек входа в граф `schema/entrypoints`</span>
- <span class="fragment">M5: Расширение Entity прямыми связями по id</span>
- <span class="fragment">M6: Создание DataLoaders (N+1) `schema/dataLoaders`</span>
- <span class="fragment">M7: Создание резолверов Реляций `schema/relations`</span>
- <span class="fragment">M8: Прикручивание QueryCost (DoS)</span>
- <span class="fragment">M9: Авторизация</span>

-----

### Types & fields are different ☝️ <!-- .element: class="orange" -->

- <span class="green">GraphQL types</span>
  - Entities
  - Common types
- <span class="green">GraphQL fields (FieldConfigs)</span>
  - Entrypoints
  - Relations
  - DataLoaders

-----

#### Repo: <https://github.com/nodkz/wrike-graphql>

#### Live demo: <https://graphql-wrike.herokuapp.com>

#### Voyager: <https://graphql-wrike.herokuapp.com/voyager>

#### Docker: <https://hub.docker.com/r/nodkz/wrike-graphql>
