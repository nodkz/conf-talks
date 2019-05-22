# GraphQL

![Logo](../assets/logo/graphql.png) <!-- .element: style="width: 300px;" class="plain"  -->

## стильно, модно, молодёжно

-----

## Плюсы: <!-- .element: class="green" -->

- Язык запросов для вашего API (что просите, то получаете)
- Интроспекция API из коробки (документация) <!-- .element: class="fragment" -->
- Удобная IDE в браузере (на поиграть с API) <!-- .element: class="fragment" -->
- Ваше API статически типизированное (интерпрайзненько) <!-- .element: class="fragment" -->
- Получить несколько ресурсов за 1 запрос (REST must die) <!-- .element: class="fragment" -->

-----

## Минусы: <!-- .element: class="red" -->

- Берет и выкидывает все выработанные годами  практики <!-- .element: class="fragment" -->
  - кеширования <!-- .element: class="fragment" -->
  - авторизации <!-- .element: class="fragment" -->
- Добавляет новых задач <!-- .element:  class="fragment" style="padding-top: 25px" -->
  - Query cost <!-- .element: class="fragment" -->
  - N+1 query <!-- .element: class="fragment" -->

-----

## Но так или иначе ☝️

### GraphQL — это светлое будущее любой микросервисной архитектуры <!-- .element: class="fragment orange"  -->

- Клиенты легко находят нужную информацию <!-- .element: class="fragment" -->
- Батчинг запроса (великий склеиватель) <!-- .element: class="fragment" -->
  - Параллельное обращение к микросервисам <!-- .element: class="fragment" -->
  - Последовательное обращение к микросервисам <!-- .element: class="fragment" -->
  
<span><b>Любая комбинация, которую `запросил клиент`, исходя из того, что связями `разрешил бэкендер`</b></span> <!-- .element: class="fragment green" -->