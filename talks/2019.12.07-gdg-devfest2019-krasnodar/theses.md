# Что такое GraphQL для бэкендера?

- Что такое GraphQL?
  - Не база
  - Алтернатива REST
  - Офиц/неофиц определение
    - это набор функций с типизированным аргументом и результатом
    - это язык запросов к вашему АПИ
  - Контракт между клиентом и сервером

- Фичи GraphQL
  - Язык запросов для API (что просите, то получаете)
  - Интроспекция API из коробки (документация)
  - Удобная IDE в браузере (на поиграть с API)
  - Ваше API статически типизированное (интерпрайзненько)
  - Получить несколько ресурсов за 1 запрос (REST must die)
  - Does your GraphQL replacement have a type system, schema introspection, and GraphiQL-like API explorer that works out of the box with every API? You need these to replace GraphQL
    - <https://twitter.com/southpolesteve/status/1183846300690898951>
    - <https://medium.com/@__xuorig__/is-graphql-still-relevant-in-an-http2-world-64964f207b8>

- Как запрашивать данные с GraphQL-сервера
  - Интроспекция
    - сервер рассказывает о своих возможностях
    - клиент заявляет о своих потребностях
  - через GraphiQL и производные тулзы
  - postman & insomnia
  - curl на сервере
  - fetch в браузере
  - поумневший (обернутый) fetch
  - навернутый клиент Apollo/Relay

- Что такое GraphQL на сервере?
  - graphql package
    - graphql schema
    - graphql query execution
  - graphql server
    - парсинг реквеста
      - куки
      - заголовки
      - body
    - базовая авторизация
    - формирование контекста
    - логирование
    - упаковка ответа

- Подходы в построении GraphQL-схем на NodeJS
  - graphql
  - graphql-tools
  - graphql-compose
  - type-graphql
  - nexus
  - сравнение <https://nodkz.github.io/conf-talks/talks/2019.05.12-zlit-tech-kyiv/index.html#/13/1>

- GraphQL VS REST
  - Минусы реста
  - Концептуальная разница между двумя подходами
  - Плюсы Графкуэля
  - Минусы Графкуэля
  - GraphQL – это удобный и строгий язык для общения между сервером и клиентом.
  - А еще Графкуэль со своими фрагментами отлично дополняет компонентный подход

- Мысылъ года
  - Микросервисная реализация, монолитная статическая типизация!

-----

Pavel Chertorogov
ps.kz, Архитектор информационных систем
<https://www.dropbox.com/s/22mncow425wsvwu/%20HolyJS%20%D0%BF%D0%BE%D1%80%D1%82%D1%80%D0%B5%D1%82%D1%8B%20%D1%81%D0%BF%D0%B8%D0%BA%D0%B5%D1%80%D0%BE%D0%B2-53.jpg?dl=0>

GraphQL-ниндзя, разработчик интернет-продуктов, опенсорс-мейнтейнер. С 2001 года основная специализация - веб-технологии. Обладает обширными практическими знаниями по бэкенду, фронтенду, администрированию и построению архитектуры. С конца 2015 года делает основной упор на изоморфные приложения. Летом 2016 начал разработку graphql-compose (генератора GraphQL-схем) в опенсорсе. Написал достаточно много материала на русском про GraphQL – <https://github.com/nodkz/conf-talks>. В 2019 начал формировать best practice по дизайну GraphQL-схем – <https://graphql-rules.com>.

Twitter - @nodkz
Telegram - <https://t.me/graphql_ru>
GitHub - <https://github.com/nodkz>
