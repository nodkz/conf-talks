## Что происходит на клиенте? (+-10 мин)

Объясню зачем нужен какой-то специальный GraphQL-клиент на клиенте для клиента (суровая тавтология). Расскажу про архитектуру ApolloClient и Relay.

-----

## GraphQL-клиенты созданы чтобы штурмовать GraphQL-сервера.

-----

## И предоставлять полученные данные

### по-простому в лоб<!-- .element: class="fragment orange" -->

### или капитально и оптимально <!-- .element: class="fragment green" -->

-----

## По-простому в лоб

- 🛵 Отправили запрос получили ответ <!-- .element: class="fragment" -->
- 🚜 Возможно, по строке запроса закешировали <!-- .element: class="fragment" -->
- 🚕 Возможно, во время запроса сообщали о текущем состоянии, вызывая коллбэки и хуки <!-- .element: class="fragment" -->

-----

## А вот как <span class="red">капитально</span> и <span class="orange">оптимально</span>

### надо разбирать подробнее

-----

<table><tr>
  <td style="vertical-align: middle">
    <h3 id="-">🔥 Капитально ... <small>(на этапе разработки)</small></h3>
    <ul>
      <li class="fragment">Позволяют сделать GraphQL-запросы составными из <span class="green">фрагментов</span></li>
      <li class="fragment">Генерируют <span class="green">тайп дефинишены</span> из запросов</li>
      <li class="fragment">Позволяют сделать запросы <span class="green">персистентными</span></li>
    </ul>
  </td><td>
    <a href="slides/01-intro/tough2.jpg" target="_blank">
      <img src="slides/01-intro/tough.jpg" alt="tough" style="min-width: 200px;" class="plain">
    </a>
  </td>
</tr></table>

-----

<table><tr>
  <td>
    <a href="slides/01-intro/tough2.jpg" target="_blank">
      <img src="slides/01-intro/tough.jpg" alt="tough" style="min-width: 200px;" class="plain">
    </a>
  </td>
  <td style="vertical-align: middle">
    <h3 id="-">🔥 Капитально ... </h3>
    <span class="green">Цель: декомпозировать кодовую базу и проверять статическим анализатором.</span>
    <br/><br/>Упор на качество и стабильность кода.
  </td>
</tr></table>

-----

<table><tr>
  <td style="vertical-align: middle">
    <h3 id="-">🔥 ... оптимально <small>(в рантайме)</small></h3>
    <ul>
      <li class="fragment">Распилили ответ и положили в <span class="green">нормализованный стор</span></li>
      <li class="fragment">Предоставили <span class="green">подписки</span> на изменение кусочков данных в сторе</li>
      <li class="fragment">Дали <span class="green">оптимистичные апдейты</span></li>
      <li class="fragment">Завели <span class="green">сборщик мусора</span></li>
      <li class="fragment">Предложили вручную <span class="green">изменять данные в сторе</span></li>
    </ul>
  </td><td>
    <a href="slides/01-intro/sophisticated2.jpg" target="_blank">
      <img src="slides/01-intro/sophisticated.jpg" alt="sophisticated" style="max-height: 1000px;" class="plain">
    </a>
  </td>
</tr></table>

-----

<table><tr>
  <td>
    <a href="slides/01-intro/sophisticated2.jpg" target="_blank">
      <img src="slides/01-intro/sophisticated.jpg" alt="sophisticated" style="max-height: 1000px;" class="plain">
    </a>
  </td>
  <td style="vertical-align: middle">
    <h3 id="-">🔥 ... оптимально <small>(в рантайме)</small></h3>
    <span class="green">Цель: эффективно работать со стором, <br/> точечно получать уведомления на изменения данных в сторе.</span>
    <br/><br/>Упор на скорость и производительность.
  </td>
</tr></table>

-----

## Какие клиенты существуют

- 🔥 `Relay` – amazing performance (complexity)
- 🔥 `ApolloClient`  – balance between features and complexity
- 🚕 `graphql-hooks` – simple for React
- 🚕 `urql` – simple for React
- 🚕 `graphql.js` – simple for vanilla JS, support fragments
- 🚜 `Lokka` – simple for vanilla JS
- 🚜 `graphql-request` – 150 LoC wrapper for fetch
- 🛵 `fetch` – Fetch API

<https://github.com/nodkz/conf-talks/tree/master/articles/graphql/clients>

-----

## Будем разбирать и сравнивать

## `ApolloClient` и `Relay`

### У них есть <span class="red fragment">генераторы</span>, <span class="green fragment">нормализованный стор</span> и поддержка <span class="orange fragment">фрагментов</span>.

-----

#### 30 апреля 2019 Марк Цукерберг <br/>презентовал новую версию [facebook.com](https://facebook.com)

![fb2019](https://user-images.githubusercontent.com/1946920/57100220-2c4ba400-6d40-11e9-983f-387d8409fc8f.png) <!-- .element: style="max-width: 1000px;" class="plain"  -->

-----

## Теперь facebook.com cупер быстрый и оптимизированный <!-- .element: class="fragment green" -->

[Building the New facebook.com with React, GraphQL and Relay](https://developers.facebook.com/videos/2019/building-the-new-facebookcom-with-react-graphql-and-relay/)

40 минут увлекательного видео

## Трындец одним словом, опять задрали планку фронтендерам <!-- .element: class="fragment red" -->

-----

## Ну что ж, в 2019 <span class="orange">Relay</span> получит

## второе дыхание хайпа.

#### <br/>И не говорить про него в своем докладе — это кощунство. <!-- .element: class="fragment orange" -->

-----

## Архитектура Relay и ApolloClient

<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="1231px" height="586px" viewBox="-0.5 -0.5 926 441">
    <defs/>
    <g>
        <rect x="150" y="0" width="310" height="440" rx="7" ry="7" fill="#ff9408" stroke="#c73500" pointer-events="none" />
        <rect x="170" y="60" width="270" height="115" rx="7" ry="7" fill="#1ba1e2" stroke="#006eaf" pointer-events="none" class="fragment" data-fragment-index="1" />
        <g transform="translate(240.5,18.5)">
            <switch>
                <foreignObject style="overflow:visible;" pointer-events="all" width="129" height="23" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility">
                    <div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 21px; font-family: Helvetica; color: rgb(255, 255, 255); line-height: 1.2; vertical-align: top; width: 129px; white-space: nowrap; overflow-wrap: normal; font-weight: bold; text-align: center;">
                        <div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;"><span style="font-size: 21px">Environment</span></div>
                    </div>
                </foreignObject>
                <text x="65" y="22" fill="#FFFFFF" text-anchor="middle" font-size="21px" font-family="Helvetica" font-weight="bold">[Not supported by viewer]</text>
            </switch>
        </g>
        <g transform="translate(263.5,75.5)" class="fragment" data-fragment-index="1">
            <switch>
                <foreignObject style="overflow:visible;" pointer-events="all" width="82" height="23" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility">
                    <div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 21px; font-family: Helvetica; color: rgb(255, 255, 255); line-height: 1.2; vertical-align: top; width: 84px; white-space: nowrap; overflow-wrap: normal; font-weight: bold; text-align: center;">
                        <div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;">Network
                            <br style="font-size: 21px" />
                        </div>
                    </div>
                </foreignObject>
                <text x="41" y="22" fill="#FFFFFF" text-anchor="middle" font-size="21px" font-family="Helvetica" font-weight="bold">[Not supported by viewer]</text>
            </switch>
        </g>
        <rect x="180" y="110" width="250" height="40" rx="7" ry="7" fill="#0050ef" stroke="#001dbc" pointer-events="none" class="fragment" data-fragment-index="3" />
        <g transform="translate(188.5,119.5)" class="fragment" data-fragment-index="3">
            <switch>
                <foreignObject style="overflow:visible;" pointer-events="all" width="232" height="20" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility">
                    <div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 19px; font-family: Helvetica; color: rgb(255, 255, 255); line-height: 1.2; vertical-align: top; width: 234px; white-space: nowrap; overflow-wrap: normal; text-align: center;">
                        <div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;"><span style="font-size: 19px">relay-network-layer-modern</span></div>
                    </div>
                </foreignObject>
                <text x="116" y="20" fill="#ffffff" text-anchor="middle" font-size="19px" font-family="Helvetica">[Not supported by viewer]</text>
            </switch>
        </g>
        <rect x="170" y="197" width="270" height="225" rx="7" ry="7" fill="#60a917" stroke="#2d7600" pointer-events="none" class="fragment" data-fragment-index="2" />
        <g transform="translate(278.5,218.5)" class="fragment" data-fragment-index="2">
            <switch>
                <foreignObject style="overflow:visible;" pointer-events="all" width="53" height="23" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility">
                    <div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 21px; font-family: Helvetica; color: rgb(255, 255, 255); line-height: 1.2; vertical-align: top; width: 55px; white-space: nowrap; overflow-wrap: normal; font-weight: bold; text-align: center;">
                        <div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;">Store</div>
                    </div>
                </foreignObject>
                <text x="27" y="22" fill="#FFFFFF" text-anchor="middle" font-size="21px" font-family="Helvetica" font-weight="bold">Store</text>
            </switch>
        </g>
        <rect x="180" y="267" width="250" height="40" rx="7" ry="7" fill="#008a00" stroke="#005700" pointer-events="none" class="fragment" data-fragment-index="4" />
        <g transform="translate(237.5,275.5)" class="fragment" data-fragment-index="4">
            <switch>
                <foreignObject style="overflow:visible;" pointer-events="all" width="134" height="23" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility">
                    <div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 21px; font-family: Helvetica; color: rgb(255, 255, 255); line-height: 1.2; vertical-align: top; width: 136px; white-space: nowrap; overflow-wrap: normal; text-align: center;">
                        <div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;">RecordSource
                            <br style="font-size: 21px" />
                        </div>
                    </div>
                </foreignObject>
                <text x="67" y="22" fill="#ffffff" text-anchor="middle" font-size="21px" font-family="Helvetica">[Not supported by viewer]</text>
            </switch>
        </g>
        <rect x="180" y="317" width="250" height="40" rx="7" ry="7" fill="#008a00" stroke="#005700" pointer-events="none" class="fragment" data-fragment-index="5" />
        <g transform="translate(241.5,325.5)" class="fragment" data-fragment-index="5">
            <switch>
                <foreignObject style="overflow:visible;" pointer-events="all" width="126" height="23" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility">
                    <div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 21px; font-family: Helvetica; color: rgb(255, 255, 255); line-height: 1.2; vertical-align: top; width: 128px; white-space: nowrap; overflow-wrap: normal; text-align: center;">
                        <div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;">Subscriptions
                            <br style="font-size: 21px" />
                        </div>
                    </div>
                </foreignObject>
                <text x="63" y="22" fill="#ffffff" text-anchor="middle" font-size="21px" font-family="Helvetica">[Not supported by viewer]</text>
            </switch>
        </g>
        <rect x="180" y="367" width="250" height="40" rx="7" ry="7" fill="#008a00" stroke="#005700" pointer-events="none" class="fragment" data-fragment-index="6" />
        <g transform="translate(216.5,375.5)" class="fragment" data-fragment-index="6">
            <switch>
                <foreignObject style="overflow:visible;" pointer-events="all" width="176" height="23" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility">
                    <div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 21px; font-family: Helvetica; color: rgb(255, 255, 255); line-height: 1.2; vertical-align: top; width: 178px; white-space: nowrap; overflow-wrap: normal; text-align: center;">
                        <div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;">GarbageCollector
                            <br style="font-size: 21px" />
                        </div>
                    </div>
                </foreignObject>
                <text x="88" y="22" fill="#ffffff" text-anchor="middle" font-size="21px" font-family="Helvetica">[Not supported by viewer]</text>
            </switch>
        </g>
        <path d="M 325 30 L 325 30" fill="none" stroke="#66b2ff" stroke-width="3" stroke-miterlimit="10" pointer-events="none" />
        <rect x="490" y="0" width="310" height="440" rx="7" ry="7" fill="#125775" stroke="#118583" pointer-events="none" />
        <rect x="510" y="60" width="270" height="115" rx="7" ry="7" fill="#1ba1e2" stroke="#006eaf" pointer-events="none" class="fragment" data-fragment-index="1" />
        <g transform="translate(586.5,5.5)">
            <switch>
                <foreignObject style="overflow:visible;" pointer-events="all" width="124" height="48" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility">
                    <div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 21px; font-family: Helvetica; color: rgb(255, 255, 255); line-height: 1.2; vertical-align: top; width: 124px; white-space: nowrap; overflow-wrap: normal; font-weight: bold; text-align: center;">
                        <div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;">ApolloClient
                            <br /><font style="font-size: 15px">(QueryManager)</font>
                            <br />
                        </div>
                    </div>
                </foreignObject>
                <text x="62" y="35" fill="#FFFFFF" text-anchor="middle" font-size="21px" font-family="Helvetica" font-weight="bold">[Not supported by viewer]</text>
            </switch>
        </g>
        <g transform="translate(590.5,75.5)" class="fragment" data-fragment-index="1">
            <switch>
                <foreignObject style="overflow:visible;" pointer-events="all" width="108" height="23" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility">
                    <div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 21px; font-family: Helvetica; color: rgb(255, 255, 255); line-height: 1.2; vertical-align: top; width: 110px; white-space: nowrap; overflow-wrap: normal; font-weight: bold; text-align: center;">
                        <div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;"><span>ApolloLink</span>
                            <br style="font-size: 21px" />
                        </div>
                    </div>
                </foreignObject>
                <text x="54" y="22" fill="#FFFFFF" text-anchor="middle" font-size="21px" font-family="Helvetica" font-weight="bold">[Not supported by viewer]</text>
            </switch>
        </g>
        <rect x="520" y="110" width="250" height="40" rx="7" ry="7" fill="#0050ef" stroke="#001dbc" pointer-events="none" class="fragment" data-fragment-index="3" />
        <g transform="translate(571.5,119.5)" class="fragment" data-fragment-index="3">
            <switch>
                <foreignObject style="overflow:visible;" pointer-events="all" width="146" height="20" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility">
                    <div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 19px; font-family: Helvetica; color: rgb(255, 255, 255); line-height: 1.2; vertical-align: top; width: 148px; white-space: nowrap; overflow-wrap: normal; text-align: center;">
                        <div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;"><span>Link middlewares</span>
                            <br />
                        </div>
                    </div>
                </foreignObject>
                <text x="73" y="20" fill="#ffffff" text-anchor="middle" font-size="19px" font-family="Helvetica">&lt;span&gt;Link middlewares&lt;/span&gt;&lt;br&gt;</text>
            </switch>
        </g>
        <rect x="510" y="197" width="270" height="225" rx="7" ry="7" fill="#60a917" stroke="#2d7600" pointer-events="none" class="fragment" data-fragment-index="2" />
        <g transform="translate(548.5,209.5)" class="fragment" data-fragment-index="2">
            <switch>
                <foreignObject style="overflow:visible;" pointer-events="all" width="202" height="48" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility">
                    <div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 21px; font-family: Helvetica; color: rgb(255, 255, 255); line-height: 1.2; vertical-align: top; width: 204px; white-space: nowrap; overflow-wrap: normal; font-weight: bold; text-align: center;">
                        <div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;"><span>ApolloCache </span>
                            <br /><span><font style="font-size: 17px">(apollo-cache-inmemory)</font></span></div>
                    </div>
                </foreignObject>
                <text x="101" y="35" fill="#FFFFFF" text-anchor="middle" font-size="21px" font-family="Helvetica" font-weight="bold">[Not supported by viewer]</text>
            </switch>
        </g>
        <rect x="520" y="267" width="250" height="40" rx="7" ry="7" fill="#008a00" stroke="#005700" pointer-events="none" class="fragment" data-fragment-index="4" />
        <g transform="translate(561.5,275.5)" class="fragment" data-fragment-index="4">
            <switch>
                <foreignObject style="overflow:visible;" pointer-events="all" width="166" height="23" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility">
                    <div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 21px; font-family: Helvetica; color: rgb(255, 255, 255); line-height: 1.2; vertical-align: top; width: 168px; white-space: nowrap; overflow-wrap: normal; text-align: center;">
                        <div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;"><span>NormalizedCache</span>
                            <br style="font-size: 21px" />
                        </div>
                    </div>
                </foreignObject>
                <text x="83" y="22" fill="#ffffff" text-anchor="middle" font-size="21px" font-family="Helvetica">[Not supported by viewer]</text>
            </switch>
        </g>
        <rect x="520" y="317" width="250" height="40" rx="7" ry="7" fill="#008a00" stroke="#005700" pointer-events="none" class="fragment" data-fragment-index="5" />
        <g transform="translate(522.5,325.5)" class="fragment" data-fragment-index="5">
            <switch>
                <foreignObject style="overflow:visible;" pointer-events="all" width="244" height="23" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility">
                    <div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 21px; font-family: Helvetica; color: rgb(255, 255, 255); line-height: 1.2; vertical-align: top; width: 246px; white-space: nowrap; overflow-wrap: normal; text-align: center;">
                        <div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;"><span><font style="font-size: 15px">watches: Set&lt;Cache.WatchOptions&gt;</font></span>
                            <br style="font-size: 21px" />
                        </div>
                    </div>
                </foreignObject>
                <text x="122" y="22" fill="#ffffff" text-anchor="middle" font-size="21px" font-family="Helvetica">[Not supported by viewer]</text>
            </switch>
        </g>
        <rect x="520" y="367" width="250" height="40" rx="7" ry="7" fill="#008a00" stroke="#005700" pointer-events="none" class="fragment" data-fragment-index="6" />
        <g transform="translate(579.5,375.5)" class="fragment" data-fragment-index="6">
            <switch>
                <foreignObject style="overflow:visible;" pointer-events="all" width="130" height="23" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility">
                    <div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 21px; font-family: Helvetica; color: rgb(255, 255, 255); line-height: 1.2; vertical-align: top; width: 130px; white-space: nowrap; overflow-wrap: normal; text-align: center;">
                        <div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;"><font>🤗 </font><font>ждем-с </font><font>v3</font>
                            <br />
                        </div>
                    </div>
                </foreignObject>
                <text x="65" y="22" fill="#ffffff" text-anchor="middle" font-size="21px" font-family="Helvetica">[Not supported by viewer]</text>
            </switch>
        </g>
        <path d="M 789 30 L 789 30" fill="none" stroke="#66b2ff" stroke-width="3" stroke-miterlimit="10" pointer-events="none" />
        <image x="0" y="149.5" width="119" height="70" xlink:href="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNTAwIiBoZWlnaHQ9IjE0NzUiIHZpZXdCb3g9IjAgMCAyNTYgMTUxIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCI+PHBhdGggZD0iTTIwOC42MTUgMTE5LjkwOEg5Ni42ODNjLTEwLjUzNyAwLTE5LjExLTguNTcyLTE5LjExLTE5LjEwNyAwLTEwLjUzOSA4LjU3Mi0xOS4xMTEgMTkuMTEtMTkuMTExaDYxLjEyOWMxNy44NCAwIDMyLjM1My0xNC41MTMgMzIuMzUzLTMyLjM1MyAwLTE3Ljg0LTE0LjUxMi0zMi4zNTQtMzIuMzUzLTMyLjM1NEg0Ny4yMjNDNDQuMTcgNy4xNDMgMzQuOTk1IDAgMjQuMTUyIDAgMTAuODExIDAgMCAxMC44MSAwIDI0LjE1MmMwIDEzLjM0MSAxMC44MTIgMjQuMTUyIDI0LjE1MyAyNC4xNTIgMTEuMjM5IDAgMjAuNjg3LTcuNjc3IDIzLjM4MS0xOC4wNzZoMTEwLjI3OWMxMC41MzUgMCAxOS4xMDcgOC41NzMgMTkuMTA3IDE5LjExIDAgMTAuNTM2LTguNTcyIDE5LjEwOS0xOS4xMDcgMTkuMTA5aC02MS4xM2MtMTcuODM5IDAtMzIuMzUzIDE0LjUxMy0zMi4zNTMgMzIuMzU0IDAgMTcuODQgMTQuNTEzIDMyLjM1MiAzMi4zNTQgMzIuMzUyaDExMS45M2MyLjg3OCAxMC4xMjEgMTIuMTg5IDE3LjUzIDIzLjIzNCAxNy41MyAxMy4zNDEgMCAyNC4xNTItMTAuODEgMjQuMTUyLTI0LjE1MSAwLTEzLjM0Mi0xMC44MS0yNC4xNTItMjQuMTUyLTI0LjE1Mi0xMS4wNDQgMC0yMC4zNTQgNy40MDgtMjMuMjMzIDE3LjUyOHoiIGZpbGw9IiNGMjZCMDAiLz48L3N2Zz4=" preserveAspectRatio="none" pointer-events="none" />
        <image x="839.5" y="144.5" width="85" height="85" xlink:href="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjU2cHgiIGhlaWdodD0iMjU2cHgiIHZpZXdCb3g9IjAgMCAyNTYgMjU2IiB2ZXJzaW9uPSIxLjEiIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIj4mI3hhOyAgICA8Zz4mI3hhOyAgICAgICAgPHBhdGggZD0iTTE2MC4yMjcsMTc4LjUxODYgTDE4Ny44NTcsMTc4LjUxODYgTDE0My43NSw2NC4wNDg2IEwxMTMuMjAxLDY0LjA0ODYgTDY5LjA5NCwxNzguNTE4NiBMOTYuNzI2LDE3OC41MTg2IEwxMDMuOTM0LDE1OS4xMjg2IEwxNDUuNjA5LDE1OS4xMjg2IEwxMzguMDY1LDEzNy42NzI2IEwxMTAuNjI1LDEzNy42NzI2IEwxMjguNDc1LDg4LjQxODYgTDE2MC4yMjcsMTc4LjUxODYgWiBNMjUxLjMzOSw5My43NjggQzI1MC4zNTcsOTAuMjMyIDI0Ni43MDUsODguMTU1IDI0My4xNTQsODkuMTQxIEMyMzkuNjE3LDkwLjEyMyAyMzcuNTQ0LDkzLjc4NyAyMzguNTI2LDk3LjMyNCBDMjQxLjI5OSwxMDcuMzA5IDI0Mi43MDQsMTE3LjYzIDI0Mi43MDQsMTI4IEMyNDIuNzA0LDE5MS4yNDggMTkxLjI0OCwyNDIuNzAyIDEyOCwyNDIuNzAyIEM2NC43NTIsMjQyLjcwMiAxMy4yOTcsMTkxLjI0OCAxMy4yOTcsMTI4IEMxMy4yOTcsNjQuNzUxIDY0Ljc1MiwxMy4yOTYgMTI4LDEzLjI5NiBDMTU0Ljc5MywxMy4yOTYgMTgwLjcxOCwyMi44MTQgMjAxLjE3OSwzOS43NTIgQzIwMC4zODMsNDEuNjUyIDE5OS45NDEsNDMuNzM3IDE5OS45NDEsNDUuOTI1IEMxOTkuOTQxLDU0Ljc2IDIwNy4xMDMsNjEuOTIyIDIxNS45MzgsNjEuOTIyIEMyMjQuNzczLDYxLjkyMiAyMzEuOTM1LDU0Ljc2IDIzMS45MzUsNDUuOTI1IEMyMzEuOTM1LDM3LjA5IDIyNC43NzMsMjkuOTI4IDIxNS45MzgsMjkuOTI4IEMyMTQuMjM3LDI5LjkyOCAyMTIuNiwzMC4xOTkgMjExLjA2MiwzMC42OTEgQzE4OC4wMjIsMTEuMDU2IDE1OC41MTMsMCAxMjgsMCBDNTcuNDIxLDAgMCw1Ny40MiAwLDEyOCBDMCwxOTguNTc5IDU3LjQyMSwyNTUuOTk5IDEyOCwyNTUuOTk5IEMxOTguNTc5LDI1NS45OTkgMjU2LDE5OC41NzkgMjU2LDEyOCBDMjU2LDExNi40MjggMjU0LjQzMywxMDQuOTEgMjUxLjMzOSw5My43NjggWiIgZmlsbD0iIzExMkI0OSIvPiYjeGE7ICAgIDwvZz4mI3hhOzwvc3ZnPg==" preserveAspectRatio="none" pointer-events="none" />
    </g>
</svg>

-----

#### Очень показательно [issue 3965](https://github.com/apollographql/apollo-client/issues/3965), где Mike Marcacci делится опытом работы отображения объектов на карте при изменении Viewport'a:

<img width="1400" alt="Screen Shot 2019-05-20 at 11 02 29 PM" src="https://user-images.githubusercontent.com/1946920/58238533-1f730c80-7d50-11e9-8163-5e324b8c5fa2.png">

-----

#### Очень показательно [issue 3965](https://github.com/apollographql/apollo-client/issues/3965), где Mike Marcacci делится опытом работы отображения объектов на карте при изменении Viewport'a:

- <span class="apollo">ApolloClient</span> – <b>"is drastically slow down"</b> 👎
- <span class="orange">Relay</span> – <b>"total lack of communication"</b> 👎

-----

## Быстрое сравнение с Redux  <!-- .element: class="red" -->

- Создание стора – нет такой задачи в вашем спринте. <!-- .element: class="fragment" -->
- Нет редьюсеров. <!-- .element: class="fragment" -->
- Экшены – это GraphQL-запросы. <!-- .element: class="fragment" -->
- Коннект – это компоненты Query, Mutation, FragmentContainer и прочие хуки. <!-- .element: class="fragment" -->
- Garbage Collector'а в Redux нет <!-- .element: class="fragment" -->

<span class="fragment green">Чуть подробнее про [Redux - бойлерплейт vs Relay/ApolloClient](https://github.com/nodkz/conf-talks/tree/master/articles/redux)</span>

-----

## И помните ☝️

### Вам не нужен Redux для Apollo/Relay!
