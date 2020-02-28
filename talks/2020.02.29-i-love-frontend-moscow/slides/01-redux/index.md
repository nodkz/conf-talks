# За что мы не любим Redux?

-----

## Сперва 2 хороших твита из 2018 года

-----

![andrew](./tweet_andrew_clark.png)

<span class="red">Redux – это тупой EventEmitter</span> c непропорционально крутой экосистемой инструментов, построенных на нём.

Интересно, <span class="red">какие возможности мы упустили</span> для этой экосистемы.

Представьте если бы эти инструменты сразу <span class="red">создавались не на тупом EventEmitter'е</span>, а на React'е.

-----

![dan](./tweet_dan_abramov.png)

Redux по сути очень прост. И его концепт великолепен. Но стало бы лучше, если ядро было менее примитивным?

-----

## Ядро Redux (великолепный концепт):

![redux_core](./redux_core.png) <!-- .element: class="plain"  -->

-----

### Redux просит вас:

- описывать состояние простыми объектами и массивами
- описывать изменения в системе простыми объектами
- описывать логику изменений в чистых (pure) функциях

-----

На самом деле это довольно сильные ограничения...

<https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367>

-----

### Эти ограничения позволяют: <!-- .element: class="green" -->

- Подписываться на изменения в Сторе
- Сохранять состояние в LocalStorage
- Boot состояния с сервера или LocalStorage
- Сохранение данных экшенов (тайм-тревелинг и дебаг)
- Возможно реализовать Undo операции
- Изоляция бизнес-логики от UI компонент

-----

### Всё ли так радужно с Redux? <!-- .element: class="orange" -->

Результаты небольшого опроса (август 2018) <https://docs.google.com/spreadsheets/d/1JsjzDeiUiPkapN2q5ueN5cOYwLNbjNnjwagon3sniJE/edit?usp=sharing>

-----

### Используете ли вы статический анализ? <!-- .element: class="orange" -->

- 37.9 – Typescript
- 37.9 – Flowtype
- 24.1 – нет

-----

### С каким серверным API используете Redux? <!-- .element: class="orange" -->

- 41.1% – REST
- 20.7% – REST + Swagger
- 13.8% – GraphQL
- 12.4% – rpc, protobuf, вебсокеты
- 8.2% – ни с каким

-----

### Что бы вы посоветовали использовать вместо Redux? <!-- .element: class="orange" -->

- 38% – Mobx
- 23% – лучше Redux, только Redux
- 15% – Cerébral (Overmind)
- 15% – Apollo

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

-----

Чуть подробнее про Redux vs Apollo в статье <https://github.com/nodkz/conf-talks/tree/master/articles/redux>
