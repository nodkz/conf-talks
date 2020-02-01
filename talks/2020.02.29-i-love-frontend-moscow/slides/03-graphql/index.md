# GraphQL – альтернативный подход

-----

- На сервере другая реализация
  - GraphQL-сервер пишется с нуля.
  - GraphQL-сервер оборачивает существующие REST-эндпоинты.
- На клиенте другой Store/State management
  - ApolloClient, Relay
- Совершенно новый уровень Developer Experience
  - One endpoint to fetch all resources.
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
    - Avoid over fetching of data (getting too many fields when only a few fields are needed).
    - Avoid under fetching of data (having to call multiple APIs because one API doesn't give back all the information needed).
