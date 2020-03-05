# За что мы не любим Redux?

-----

## Сперва 2 хороших твита из 2018 года

-----

![andrew](./tweet_andrew_clark.png)

<span class="red">Redux – это тупой EventEmitter</span> c непропорционально крутой экосистемой инструментов, построенных на нём.

Интересно, <span class="red">каковы упущенные возможности</span> этой экосистемы.

Представьте если бы эти инструменты сразу <span class="red">создавались не на тупом EventEmitter'е</span>, а на React'е.

-----

### Всё ли так радужно с Redux? <!-- .element: class="orange" -->

Результаты небольшого опроса (август 2018) <https://docs.google.com/spreadsheets/d/1JsjzDeiUiPkapN2q5ueN5cOYwLNbjNnjwagon3sniJE/edit?usp=sharing>

-----

### Первая проблема <!-- .element: class="gray" -->

## БОЙЛЕРПЛЕЙТ <!-- .element: class="red" -->

<br/>

Все жалуются на "обезьянство": добавь константу, добавь экшен, добавь обработку в редюсер. <!-- .element: class="fragment" -->

Много букв, значит много мест, где можно ошибиться <br/>Тяжелее рефакторить. Тяжелее вводить новичков в курс дела.<!-- .element: class="fragment" -->

-----

### Вторая проблема <!-- .element: class="gray" -->

## грамотное построение Стора <!-- .element: class="red" -->

<br/>

Советуют держать нормализованный стейт, не дублировать данные, бить редьюсеры на маленькие, переиспользовать action'ы в разных редьюсерах. <!-- .element: class="fragment" -->

-----

### Третья проблема <!-- .element: class="gray" -->

### маппинг серверных данных в Стор <!-- .element: class="red" -->

<br/>

Фигово, если АПИ часто меняется. <br/>Надо хорошо покрывать тестами. <br/>Пляски со статической типизацией. <br/>Здорово, если есть Swagger. <!-- .element: class="fragment" -->

-----

## А что если с Сервером и Стором <br/> всё-таки работать иначе? <!-- .element: class="green" -->

- не строить Стор руками <!-- .element: class="fragment" -->
- не писать никакого маппера данных с сервера в Стор <!-- .element: class="fragment" -->
- иметь автогенерируемые дефинишены для статического анализа ответов с сервера <!-- .element: class="fragment" -->

-----

## ApolloClient и GraphQL <!-- .element: class="green" -->

## берут на себя проблемы <br/>получения и хранения данных в Сторе.

## Предлагают хорошую статическую типизацию. <!-- .element: class="fragment orange" -->

-----

### Если получаете много разных данных с сервера <!-- .element: class="orange" -->

### И бекендеры могут дать GraphQL API <!-- .element: class="fragment" -->

### То однозначно пробуйте Apollo Client! <!-- .element: class="fragment green" -->

-----

### C Redux вы императивно управляете Стором. <!-- .element: class="orange" -->

## А с ApolloClient – декларативно! <!-- .element: class="green fragment" -->
