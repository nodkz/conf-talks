# 5 подходов к построению схем

![Диаграмма экосистемы](./diagram-ecosystem-schema.svg) <!-- .element: style="width: 90vw;" class="plain"  -->

-----

<style>
  .no-bottom-border > * > * > * > * {
    border-bottom: none !important;
  }
</style>

<div class="no-bottom-border">

|                   |             |         |         |
|-------------------|-------------|---------|---------|
| `graphql`         | 2012...2015 | ![GitHub stars](https://img.shields.io/github/stars/graphql/graphql-js.svg?color=lightgrey) <!-- .element: class="plain" style="max-height: 50px; height: 40px; vertical-align: middle;" --> | ![Downloads](https://img.shields.io/npm/dw/graphql.svg?color=lightgrey) <!-- .element: class="plain" style="max-height: 50px; height: 40px; vertical-align: middle;" --> |
| `graphql-tools`   | 2016 Apr    | ![GitHub stars](https://img.shields.io/github/stars/apollographql/graphql-tools.svg?color=lightgrey) <!-- .element: class="plain" style="max-height: 50px; height: 40px; vertical-align: middle;" --> | ![Downloads](https://img.shields.io/npm/dw/graphql-tools.svg?color=lightgrey) <!-- .element: class="plain" style="max-height: 50px; height: 40px; vertical-align: middle;" --> |
| `graphql-compose` | 2016 Jul    | ![GitHub stars](https://img.shields.io/github/stars/graphql-compose/graphql-compose.svg?color=lightgrey) <!-- .element: class="plain" style="max-height: 50px; height: 40px; vertical-align: middle;" --> | ![Downloads](https://img.shields.io/npm/dw/graphql-compose.svg?color=lightgrey) <!-- .element: class="plain" style="max-height: 50px; height: 40px; vertical-align: middle;" --> |
| `type-graphql`    | 2018 Feb    | ![GitHub stars](https://img.shields.io/github/stars/19majkel94/type-graphql.svg?color=lightgrey) <!-- .element: class="plain" style="max-height: 50px; height: 40px; vertical-align: middle;" --> | ![Downloads](https://img.shields.io/npm/dw/type-graphql.svg?color=lightgrey) <!-- .element: class="plain" style="max-height: 50px; height: 40px; vertical-align: middle;" --> |
| `nexus`           | 2018 Nov    | ![GitHub stars](https://img.shields.io/github/stars/prisma/nexus.svg?color=lightgrey) <!-- .element: class="plain" style="max-height: 50px; height: 40px; vertical-align: middle;" --> | ![Downloads](https://img.shields.io/npm/dw/nexus.svg?color=lightgrey) <!-- .element: class="plain" style="max-height: 50px; height: 40px; vertical-align: middle;" --> |

</div>

-----

## Что будем строить

-----

### Github строить не будем 😈

<img width="1317" alt="GitHub" src="https://user-images.githubusercontent.com/1946920/52814229-ceef7180-30c5-11e9-8676-24e5b36180e5.png">

-----

### API Amazon AWS тоже 😳

<img height="400" alt="AWS" src="https://user-images.githubusercontent.com/1946920/52818067-eaf81080-30cf-11e9-8609-d1370af07871.png">

Нарисовано 481 нода из 6595. <br/>Спасибо Ивану Гончарову из [APIs.guru](https://apis.guru/) за помощь в генерации картинки из [graphql-compose-aws](https://github.com/graphql-compose/graphql-compose-aws).

-----

### Сегодня мы будем строить такой "хардкор"

<img width="1332" alt="Author-Article" src="https://user-images.githubusercontent.com/1946920/52814214-ca2abd80-30c5-11e9-82b2-e4e90bc6b23e.png">

### <br/> 💃💃💃

-----

### Все схемки построены с помощью <br/>[graphql-voyager](https://apis.guru/graphql-voyager/) <br/>из интроспекции GraphQL-схемы.

### Cхему GitHub можно [потыкать вживую](https://apis.guru/graphql-voyager/).
