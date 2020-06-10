# Зачем нужен GraphQL?

-----

### Кто сейчас использует GraphQL? <!-- .element: class="green" -->

#### Facebook, Coursera, Stripe, Shopify, Github, Paypal

![logos](https://user-images.githubusercontent.com/1946920/50889858-30ffeb80-1423-11e9-9768-7d247438ac51.png) <!-- .element: style="max-width: 900px;" class="plain" -->

-----

## Что чуть лучше, чем в REST API? <!-- .element: class="orange" -->

- фильтрация полей (projection) <!-- .element: class="fragment" -->
- для сложных запросов не надо на клиенте писать модели <!-- .element: class="fragment" -->
- валидация входящих аргументов <!-- .element: class="fragment" -->

-----

## Что нового приносит GraphQL? <!-- .element: class="green" -->

- вложенные запросы с аргументами <!-- .element: class="fragment" -->
- статический анализ <!-- .element: class="fragment" -->
- тулинг и DX <!-- .element: class="fragment" -->
  - документация прям в редакторе запросов <br/>(Altair, Playground, Graphiql) <!-- .element: class="fragment" -->
  - валидация запросов (CI, IDE) <!-- .element: class="fragment" -->
  - генерация тайпингов из запросов (graphql-codegen) <!-- .element: class="fragment" -->
  - визуализация схемы (Voyager) <!-- .element: class="fragment" -->
- связи между Entity (как скульный LEFT JOIN) <!-- .element: class="fragment" -->

-----

## Когда не нужен GraphQL? <!-- .element: class="red" -->

- Когда работа с файлами (download/upload) <!-- .element: class="fragment" -->
- Когда простые запросы от клиентов <!-- .element: class="fragment" -->
- Когда мало Entity и мало связей <!-- .element: class="fragment" -->

-----

## Когда очень нужен GraphQL? <!-- .element: class="green" -->

- Когда сложная Data Domain c большим кол-вом связей <!-- .element: class="fragment" -->
- Когда много клиентов и всем подавай кучу специфичных агрегаций <!-- .element: class="fragment" -->

-----

## Вопрос: <!-- .element: class="red" -->

## В новом проекте предлагают заюзать GraphQL, на котором никто не работал. Мобильщикам нравится. <br/>Плюсы, минусы, подводные камни?

-----

## Полу-ответ: <!-- .element: class="orange" -->

## Если никто не работал...

- то тяжело будет прогнозировать сроки <!-- .element: class="fragment" -->
- сразу хорошее АПИ не напишите, только раза с 3-4 <!-- .element: class="fragment" -->
- появятся новые проблемы N+1 и QueryCost (безопасность, производительность) <!-- .element: class="fragment" -->

-----

## Ответ:

## Бахните сперва что умеете – REST

## А рядом заведите Графкуэльную проксю к ресту. <!-- .element: class="green" -->

-----

## Фраза дня:

## Надо дать так, чтоб удобно было взять! <!-- .element: class="green" -->

-----

## А GraphQL, это тупо удобно для клиентов.

## Поэтому так или иначе, <br/>бэкендеров вынудят его крутить. <!-- .element: class="red fragment" -->
