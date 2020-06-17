## M1: Создание обёртки <br/>к REST API

-----

### Сперва пишем SDK

### `src/vendor`

-----

### Берем пакеты: `axios` + `debug`

- упрощает написание запросов
- отладка запросов

-----

### Воссоздаем все REST API endpoints

- 22 entity
- 87 методов

И не забываем про примитивную типизацию ☝️ <!-- .element: class="fragment orange" -->

-----

### Примитивная типизация нужна для того, чтобы отлавливать будущие изменения в REST API <!-- .element: class="green" -->

-----

### Для каждого эндпоинта <!-- .element: class="orange" -->

- даем уникальные имена всем функциям ☝️ <!-- .element: class="fragment" -->
- типизируем входящие аргументы <!-- .element: class="fragment" -->
- прописываем HTTP-метод <!-- .element: class="fragment" -->

-----

### Грубая оценка M1

`find ./src/vendor -name '*.ts' | xargs wc -l`

- 93 files
- 2275 LoC
- `⏱ 30 часов` (~20 min на эндпоинт)

-----

### Эх, был бы какой-нить OpenAPI, <br/>то можно было бы: <!-- .element: class="orange" -->

- нагенерить этого самого vendor
- и не мучиться с будущими изменениями REST API

-----

### Мучения при написании своей SDK: <!-- .element: class="red" -->

- типизация возвращаемых данных
- связи между Entity
- настройка проекции полей `fields`

Но эти штуки мы вынесем в слой GraphQL <!-- .element: class="fragment green" -->
