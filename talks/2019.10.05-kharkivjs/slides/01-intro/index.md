# Что такое <br/>GraphQL-фрагменты?

Не спешим путать с Фрагментными Моделями! <!-- .element: class="red" -->

-----

### Посмотрим на простой GraphQL-запрос

![simple query](./query.png)

-----

### Тот же самый запрос но с фрагментом

<table>
<tr>
<td style="vertical-align: top; text-align: center">
  <img src="slides/01-intro/query.png" alt="simple query">
  <small class="fragment red">Ох, уж эти инженеры!<br/>Любят же всё усложнять!</small>
</td>
<td style="vertical-align: top">
  <img src="slides/01-intro/query-with-fragment.png" alt="query with fragment">
</td>
</tr>
</table>

-----

### У фрагмент есть имя и тип

![fragment query](./query-with-fragment2.png) <!-- .element: style="max-width: 800px" -->

-----

### Благодаря типу на фрагменте <!-- .element: class="green" -->

![fragment query](./query-with-fragment2.png) <!-- .element: style="max-width: 500px" -->

- Его не заспредишь куда попало <!-- .element: class="fragment" -->
- В нем не запросишь левые поля <!-- .element: class="fragment" -->

-----

## GraphQL-запрос <br/>статически типизированная штука.

### Ошибки в теле запроса моментом проверяются.  <!-- .element: class="fragment green" -->

-----

## Так зачем же нужны <br/>GraphQL-фрагменты? <!-- .element: class="red" -->

-----

## Фрагменты позволяют описать необходимые данные для компонента 👍

-----

![component](./component.png) <!-- .element: style="max-width: 700px" class="plain" -->

Фрагмент – это кусочек серверного типа <br/>для вашего компонента на фронте <!-- .element: class="fragment" -->

-----

## Это позволяет утащить <br/>статическую типизацию <br/>с сервера на клиент <br/>🔥

-----

## Ну это я забегаю вперёд

-----

## Давайте дойдём до этого так, <br/>как доходил Facebook

Только за полчаса 😉 <!-- .element: class="orange fragment" -->

-----

## Текущяя презентация

## базируется на презентации

## Matt Mahoney (Facebook) <!-- .element: class="green" -->

<https://www.youtube.com/watch?v=Vo8nqjiKI3A>
<!-- <https://speakerdeck.com/mjmahone/scaling-your-graphql-client> -->

-----

## Садитесь поудобнее... <!-- .element: class="green" -->

-----

## Это реальная история о том... <!-- .element: class="red" -->

-----

## как Фейсбук писал модели для клиентских приложений, <br/>работая с GraphQL <!-- .element: class="orange" -->

-----

## набивал шишек <!-- .element: class="red" -->

-----

## эволюционировал <!-- .element: class="green" -->

-----

## решая те или иные проблемы <!-- .element: class="orange" -->

-----

## ИТАК...

-----

## Фейсбук прошел следующие этапы: <!-- .element: class="green" -->

<ul>
<li class="fragment visible" data-fragment-index="0">JSON Models <span class="gray">(ручное написание моделей)</span></li>
<li class="fragment visible" data-fragment-index="1">Type Models <span class="gray">(использование типизации из серверной схемы)</span></li>
<li class="fragment visible" data-fragment-index="2">Response Models <span class="gray">(типизация на уровне запроса)</span></li>
<li class="fragment visible current-fragment" data-fragment-index="3">Fragment Models <span class="gray">(типизация и инкапсуляция на уровне компонента)</span></li>
</ul>
