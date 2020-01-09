# ApolloClient 3 – прощаемся с Redux, REST API и Relay.

- За что мы не любим Redux
  - Опрос <https://docs.google.com/spreadsheets/d/1JsjzDeiUiPkapN2q5ueN5cOYwLNbjNnjwagon3sniJE/edit?usp=sharing>
  - Статья <https://github.com/nodkz/conf-talks/tree/master/articles/redux>
- За что мы не любим REST API
  - Жирные ответы
    - Научный труд от бразильцев (ссылка на доклад): we show that GraphQL can reduce the size of the JSON documents returned by REST APIs in 94% (in number of fields) and in 99% (in number of bytes), both median results.
    - Со временем в АПИ добавляются новые поля, и старые клиенты могут начать захлебываться/тормозить
  - Сложность получения связных данных
  - Скорость получения связных данных
  - Опыт Paypal (1/3 времени на разработку, 2/3 на болтавню о том что, где и как взять).
    - <https://github.com/nodkz/graphql-podcast/blob/master/2019-11-paypal/index.md#graphql-a-success-story-for-paypal-checkout>
- GraphQL алтернативный подход
  - На сервере другая реализация
    - GraphQL-сервер пишется с нуля.
    - GraphQL-сервер оборачивает существующие REST-эндпоинты.
  - На клиенте другой Store/State management
    - ApolloClient, Relay
  - Совершенно новый уровень Developer Experience
    - One endpoint to fetch all resources.
    - Avoid over fetching of data (getting too many fields when only a few fields are needed).
    - Avoid under fetching of data (having to call multiple APIs because one API doesn't give back all the information needed).
    - Сервер объявляет о своих возможностях, клиент заявляет о своих потребностях
      - Удобное написание запросов, браузерные IDE
      - Документация
    - Проверка кода в IDE и при билде
      - Линтинг запросов, через Eslint
        - Бэкендеры удалили поля, вы поймали поломанные запросы
      - Статическая типизация
        - Бэкендеры изменили тип у поля, вы поймали некорректную работу с переменной
        - Моя мысылъ прошлого года: Микросервисная реализация, монолитная статическая типизация!
    - В рантайме
      - Что просите, только то и получаете (вы готовы если АПИ будет пухнуть)
- ApolloClient3
  - На 9 января 2019 пока еще в BETA (но вот-вот будет релиз)
  - Нововведения в 3-тьей версии
    - Новая логика нормализованного стора `EntityCache`
      - Идеи и наработки взяты у Ian MacLeod (@nevir) из <https://github.com/convoyinc/apollo-cache-hermes>
        - <https://github.com/convoyinc/apollo-cache-hermes/blob/master/docs/Motivation.md>
        - <https://github.com/convoyinc/apollo-cache-hermes/blob/master/docs/Design%20Exploration.md#entities>
      - снижены косты по потреблению CPU и памяти
        - были ресурсоемкие операции записи и чтения
        - зачем нормализовывать все подряд, когда можно нормализовывать только объекты с `id` (бизнес сущности)
    - Garbage collection и возможность выборочной чистки кэша
      - Как работает GC? Начиная с ROOT_QUERY бежит вглубь собирая `__ref` в какой-нить Set. Вторым проходом пробегается по всем ключам в нормализованном кэше и удаляет те, которых нет в Set'е и в `retain`-set'е.
      - `cache.retain(id)` защитит запись от удаления из GC
      - `cache.release(id)` просто снимет отметку защиты от удаления в GC
      - `cache.evict(id)` сразу удалит запись из кэша (даже если запись защищена (`retain`))
    - Декларативная конфигурация кэша/стора
      - Сделали очень удобно и просто. Бабахнет так, как в своё время `graphql-tools` со своей простотой объявления схем.
      - `possibleTypes` - предоставляет информацию об Interfaces и Unions типах, более удобная замена для `fragmentMatcher`
      - `typePolicies: {}` – позволяют декларативно описать дополнительную логику типов
        - `keyFields: []` – указывает какие поля использовать в качестве id (работают с алиасами)
        - `keyFields: false` – отключает нормализацию типа, хранит данные в родительском объекте
      - Field policies – позволяют декларативно описать дополнительную логику полей в конкретном типе
        - `keyArgs: []` – позволяет выбрать аргументы, которые используются в качестве ключа кэша для поля с аргументами (заменяет директиву `@connection`)
        - `read(data, { args })` – позволяет настроить кастомную логику чтения данных, полезно для пагинации, заменяет настройку `cacheRedirects`
        - `merge(existingData, incomingData, { args })` – позволяет настроить кастомную логику сохранения данных в стор
    - Один пакет для всего `@apollo/client`
      - apollo-client
      - apollo-utilities
      - apollo-cache
      - apollo-cache-inmemory
      - apollo-link
      - apollo-link-http
      - @apollo/react-hooks
      - graphql-tag
    - Как заюзать ApolloClient 3
      - `npm install @apollo/client@beta`
      - `npm remove apollo-client apollo-utilities apollo-cache apollo-cache-inmemory apollo-link apollo-link-http react-apollo @apollo/react graphql-tag`
      - Следите за изменениями:
        - [Release 3.0 pull request](https://github.com/apollographql/apollo-client/pull/5116)
        - [Apollo Client Roadmap](https://github.com/apollographql/apollo-client/blob/master/ROADMAP.md)
      - Документацию можно найти в ветке `release-3.0`
        - [Cache configuration](https://github.com/apollographql/apollo-client/blob/release-3.0/docs/source/caching/cache-configuration.md)
        - [Fragment matching](https://github.com/apollographql/apollo-client/blob/release-3.0/docs/source/data/fragments.md)
  - ApolloClient3 vs Relay
    - Грубо говоря они сравнялись по функциональности. Теперь у Apollo есть GC. Ссылка на доклад сравнения архитектур Relay и ApolloClient 2.
    - Cкорее всего дорожки разошлись: ApolloClient не будет поддерживать FragmentModels (никогда не говори никогда, но в ближайший год точно). Они ударились в производительность и скорость работы кэша. А глубокая нормализация кэша требуется для работы FragmentModels (ссылка на доклад).
    - За что я перестал любить Relay
      - Основная разработка внутри фабрикатора фейсбука
      - Если у вас возник вопрос или проблема, то инженеры Фейсбука практически не отвечают в ишьюсах
      - Слабое комьюнити
      - Тяжело изучить самостоятельно и по статьям в интернете
      - Достаточно сложный внутренний код
      - Внутри Flowtype (и его тоже я перестал любить за его тормознутости и жесткость)
- Подготовить пример рабочего приложения.

-----

Pavel Chertorogov
ps.kz, Архитектор информационных систем

[Фото](https://www.dropbox.com/s/22mncow425wsvwu/%20HolyJS%20%D0%BF%D0%BE%D1%80%D1%82%D1%80%D0%B5%D1%82%D1%8B%20%D1%81%D0%BF%D0%B8%D0%BA%D0%B5%D1%80%D0%BE%D0%B2-53.jpg?dl=0)

GraphQL-ниндзя, разработчик интернет-продуктов, опенсорс-мейнтейнер. С 2001 года занимается веб-разработкой. Обладает обширными практическими знаниями по бэкенду, фронтенду, администрированию и построению архитектуры. С 2015 года делает основной упор на изоморфные приложения. Летом 2016 начал разработку graphql-compose (генератора GraphQL-схем) в опенсорсе. Написал достаточно много материала на русском про GraphQL – <https://github.com/nodkz/conf-talks>. В 2019 начал формировать best practice по дизайну GraphQL-схем – <https://graphql-rules.com>.

- Twitter - @nodkz
- Telegram - <https://t.me/graphql_ru>
- GitHub - <https://github.com/nodkz>
