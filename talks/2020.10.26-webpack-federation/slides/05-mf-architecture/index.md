# 5. Архитектура Module Federation

-----

![first draft](https://user-images.githubusercontent.com/25274700/50267904-b7557e80-03dd-11e9-833a-88a0cb145b38.png) <!-- .element: class="plain" style="background-color: white" width="700" -->

<https://github.com/webpack/webpack/issues/8524>

-----

## Terminology

- A host (consumers): a Webpack build that is initialized first during a page load (when the onLoad event is triggered)
- A remote (consumable): another Webpack build, where part of it is being consumed by a “host”
- Bidirectional hosts: when a bundle or Webpack build can work as a host or as a remote. Either consuming other applications or being consumed by others — at runtime
- Omnidirectional hosts: when bundle operates as both host and remote at the same time

-----

## Terminology

- Exposed modules – модули которые будут доступны другим приложением для импорта
- Shared module – модули которые могут быть общими для всем приложений (vendor eg React)

-----

## Advice

- State management. У каждого приложения должно быть своим. Глобальный стейт будет нарушать инкапсуляцию микросервисов. Если два микрофронтенда имеют много чего общего в стейте – скорее всего их следует объединить в один микрофронтенд.
