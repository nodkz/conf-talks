## Recap

-----

## REST API to GraphQL methodology

- <span class="fragment">M1: Создание обёртки к REST API `30 часов`</span>
- <span class="fragment">M2: Описание общих GraphQL-типов `10 часов`</span>
- <span class="fragment">M3: Описание Entity `10 часов`</span>
- <span class="fragment">M4: Описание точек входа в граф `40 часов`</span>
- <span class="fragment">M5: Расширение Entity прямыми связями по id `10 часов`</span>
- <span class="fragment">M6: Создание DataLoaders (N+1) `20 часов`</span>
- <span class="fragment">M7: Создание резолверов Реляций `20 часов`</span>
- <span class="fragment">M8: Прикручивание QueryCost `10 часов`</span>
- <span class="fragment">M9: Авторизация `10 часов`</span>

-----

### Грубая оценка всей GraphQL прокси

- 22 entity <!-- .element: class="orange" -->
- 87 REST API методов <!-- .element: class="orange" -->
- 160 часов
- 8773 строчек кода
- 275 файлов
- 134 GraphQL-типа <!-- .element: class="green" -->
- 1002 поля и аргумента <!-- .element: class="green" -->
- 77 реляций (LEFT JOIN) <!-- .element: class="green" -->

-----

## Итого нужно 160 часов, <br/> чтобы переварить 22 Еntity

## В среднем, на 1 entity<br/> уходит 1 человеко-день* <!-- .element: class="fragment green" -->

<span class="fragment gray">* не забудьте умножить на коэффициент<br/> способности-и-производительности вашего человека-дня</span>

-----

# ПЛЮС  <!-- .element: class="red" -->

## пара недель - месяц, <!-- .element: class="red" -->

## чтобы разобраться c самим GraphQL и с предложенной методологией.

-----

# Будьте аккуратны со сроками! <!-- .element: class="orange" -->

-----

# В начале будет больно! <!-- .element: class="red" -->
