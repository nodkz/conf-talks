# А что делать, если мы попадаем в обе категории?

## <div class="gray"><span class="green">Где-то подходит</span> GraphQL, <span class="red">а где-то нет</span>...</div>

-----

# Пилите два, три апи <br/>на разных технологиях! <!-- .element: class="orange" -->

-----

## Часть вашей системы может работать по одному протоколу, часть по другому.

-----

### Любое апи — это фасад ("контроллеры") перед сервисами и моделями

И напилякать их не так уж трудозатратно, если бизнес-логика у вас вынесена на свой слой абстракции и разные фасады (имплементации апи) переиспользуют её.

-----

## Например админы всяких мониторингов и сборщики метрик не любят много писа́ть

### тут старый добрый REST API будет хорош <!-- .element: class="fragment green" -->

-----

## Аналитикам и data-сайнтистам <br/>подавай возможность писа́ть <br/>SQL с LEFT JOIN'ами 

### здесь GraphQL может выступить прекрасной альтернативой <!-- .element: class="fragment green" -->

### <span class="fragment gray">и [Jora](https://github.com/discoveryjs/jora) c [DiscoveryJS](https://github.com/discoveryjs/discovery) им сильно помогут</span>

-----

## Железякам (бэкенд сервисам) <br/>подавай кратко и быстро

### здесь бы бинарный gRPC был хорош <!-- .element: class="fragment green" -->

-----

## А что же отдавать фронтендерам и мобильщикам?

-----

## <div class="green">«Просто <span class="gray">человеку</span> нужно дать так, чтобы <span class="gray">ему</span> было удобно брать»</div>

-----

### Видео для вашего (Application/Solution) Architect

- [Формируем картину GraphQL-мира (TechTrain 2019)](https://www.youtube.com/watch?v=kMARjBBe4FM)
- [GraphQL-фрагменты на клиенте: История появления, ошибки использования (HolyJS Moscow 2019)](https://www.youtube.com/watch?v=0bpZiMVJh14)
- [ApolloClient или Relay с фрагментами, «волосатый» GraphQL (HolyJS Piter 2019)](https://youtu.be/VdoPraj0QqU)
- [ApolloClient 3 — прощаемся с Redux, REST API и Relay (Я 💛 Фронтенд 2020, Moscow 2020)](https://youtu.be/5h7zX45YPuQ)
