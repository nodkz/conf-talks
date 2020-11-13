# 5. Архитектура Module Federation

- Terminology
  - A host (consumers): a Webpack build that is initialized first during a page load (when the onLoad event is triggered)
  - A remote (consumable): another Webpack build, where part of it is being consumed by a “host”
  - Bidirectional hosts: when a bundle or Webpack build can work as a host or as a remote. Either consuming other applications or being consumed by others — at runtime
  - Omnidirectional hosts: when bundle operates as both host and remote at the same time
  - Exposed modules – модули которые будут доступны другим приложением для импорта
  - Shared module – модули которые могут быть общими для всем приложений (vendor eg React)

- Advice
  - State management. У каждого приложения должно быть своим. Глобальный стейт будет нарушать инкапсуляцию микросервисов. Если два микрофронтенда имеют много чего общего в стейте – скорее всего их следует объединить в один микрофронтенд.