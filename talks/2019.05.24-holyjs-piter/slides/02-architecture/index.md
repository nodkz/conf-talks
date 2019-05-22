# Архитектура

# <span class="orange">Relay</span> и <span class="apollo">Apollo</span>

-----

## <span class="apollo">Apollo</span> пока еще копирует <span class="orange">Relay</span>

Еще скопировали не всё 😔

-----

### <span class="orange">Relay</span> пилится уже лет 5.

#### До этого у них еще от Flux'а куча шишек, боли и опыта завалялось.

-----

### <span class="apollo">ApolloClient</span> уже года три пилится.

#### До этого был Meteor, который научил работать с комьюнити.

-----

## В итоге, у <span class="orange">Relay</span> самое продвинутое двигло (синьеры знают толк в жесткости и изощренности)

## <br/>У <span class="apollo">ApolloClient</span> более навернутое комьюнити, документация (и в него банально проще вьехать)

-----

## Ну что... поехали смотреть на различия 😈

-----

### Разбираем основные пакеты

<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="949px" height="562px" viewBox="-0.5 -0.5 791 469">
    <defs/>
    <g>
        <rect x="0" y="98" width="790" height="160" fill="#dae8fc" stroke="#6c8ebf" pointer-events="none" />
        <rect x="0" y="258" width="790" height="210" fill="#fff2cc" stroke="#d6b656" pointer-events="none" />
        <rect x="95" y="116" width="310" height="130" rx="7" ry="7" fill="#ff9408" stroke="#c73500" pointer-events="none" />
        <g transform="translate(154.5,128.5)">
            <switch>
                <foreignObject style="overflow:visible;" pointer-events="all" width="190" height="34" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility">
                    <div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 30px; font-family: Helvetica; color: rgb(255, 255, 255); line-height: 1.2; vertical-align: top; width: 192px; white-space: nowrap; overflow-wrap: normal; font-weight: bold; text-align: center;">
                        <div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;">
                            <div style="font-size: 30px">relay-runtime</div>
                        </div>
                    </div>
                </foreignObject>
                <text x="95" y="32" fill="#FFFFFF" text-anchor="middle" font-size="30px" font-family="Helvetica" font-weight="bold">[Not supported by viewer]</text>
            </switch>
        </g>
        <path d="M 375 146 L 375 146" fill="none" stroke="#66b2ff" stroke-width="3" stroke-miterlimit="10" pointer-events="none" />
        <rect x="445" y="116" width="310" height="130" rx="7" ry="7" fill="#125775" stroke="#118583" pointer-events="none" />
        <path d="M 744 146 L 744 146" fill="none" stroke="#66b2ff" stroke-width="3" stroke-miterlimit="10" pointer-events="none" />
        <image x="204.5" y="14.5" width="119" height="70" xlink:href="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNTAwIiBoZWlnaHQ9IjE0NzUiIHZpZXdCb3g9IjAgMCAyNTYgMTUxIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCI+PHBhdGggZD0iTTIwOC42MTUgMTE5LjkwOEg5Ni42ODNjLTEwLjUzNyAwLTE5LjExLTguNTcyLTE5LjExLTE5LjEwNyAwLTEwLjUzOSA4LjU3Mi0xOS4xMTEgMTkuMTEtMTkuMTExaDYxLjEyOWMxNy44NCAwIDMyLjM1My0xNC41MTMgMzIuMzUzLTMyLjM1MyAwLTE3Ljg0LTE0LjUxMi0zMi4zNTQtMzIuMzUzLTMyLjM1NEg0Ny4yMjNDNDQuMTcgNy4xNDMgMzQuOTk1IDAgMjQuMTUyIDAgMTAuODExIDAgMCAxMC44MSAwIDI0LjE1MmMwIDEzLjM0MSAxMC44MTIgMjQuMTUyIDI0LjE1MyAyNC4xNTIgMTEuMjM5IDAgMjAuNjg3LTcuNjc3IDIzLjM4MS0xOC4wNzZoMTEwLjI3OWMxMC41MzUgMCAxOS4xMDcgOC41NzMgMTkuMTA3IDE5LjExIDAgMTAuNTM2LTguNTcyIDE5LjEwOS0xOS4xMDcgMTkuMTA5aC02MS4xM2MtMTcuODM5IDAtMzIuMzUzIDE0LjUxMy0zMi4zNTMgMzIuMzU0IDAgMTcuODQgMTQuNTEzIDMyLjM1MiAzMi4zNTQgMzIuMzUyaDExMS45M2MyLjg3OCAxMC4xMjEgMTIuMTg5IDE3LjUzIDIzLjIzNCAxNy41MyAxMy4zNDEgMCAyNC4xNTItMTAuODEgMjQuMTUyLTI0LjE1MSAwLTEzLjM0Mi0xMC44MS0yNC4xNTItMjQuMTUyLTI0LjE1Mi0xMS4wNDQgMC0yMC4zNTQgNy40MDgtMjMuMjMzIDE3LjUyOHoiIGZpbGw9IiNGMjZCMDAiLz48L3N2Zz4=" preserveAspectRatio="none" pointer-events="none" />
        <image x="547" y="-0.5" width="85" height="85" xlink:href="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjU2cHgiIGhlaWdodD0iMjU2cHgiIHZpZXdCb3g9IjAgMCAyNTYgMjU2IiB2ZXJzaW9uPSIxLjEiIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIj4mI3hhOyAgICA8Zz4mI3hhOyAgICAgICAgPHBhdGggZD0iTTE2MC4yMjcsMTc4LjUxODYgTDE4Ny44NTcsMTc4LjUxODYgTDE0My43NSw2NC4wNDg2IEwxMTMuMjAxLDY0LjA0ODYgTDY5LjA5NCwxNzguNTE4NiBMOTYuNzI2LDE3OC41MTg2IEwxMDMuOTM0LDE1OS4xMjg2IEwxNDUuNjA5LDE1OS4xMjg2IEwxMzguMDY1LDEzNy42NzI2IEwxMTAuNjI1LDEzNy42NzI2IEwxMjguNDc1LDg4LjQxODYgTDE2MC4yMjcsMTc4LjUxODYgWiBNMjUxLjMzOSw5My43NjggQzI1MC4zNTcsOTAuMjMyIDI0Ni43MDUsODguMTU1IDI0My4xNTQsODkuMTQxIEMyMzkuNjE3LDkwLjEyMyAyMzcuNTQ0LDkzLjc4NyAyMzguNTI2LDk3LjMyNCBDMjQxLjI5OSwxMDcuMzA5IDI0Mi43MDQsMTE3LjYzIDI0Mi43MDQsMTI4IEMyNDIuNzA0LDE5MS4yNDggMTkxLjI0OCwyNDIuNzAyIDEyOCwyNDIuNzAyIEM2NC43NTIsMjQyLjcwMiAxMy4yOTcsMTkxLjI0OCAxMy4yOTcsMTI4IEMxMy4yOTcsNjQuNzUxIDY0Ljc1MiwxMy4yOTYgMTI4LDEzLjI5NiBDMTU0Ljc5MywxMy4yOTYgMTgwLjcxOCwyMi44MTQgMjAxLjE3OSwzOS43NTIgQzIwMC4zODMsNDEuNjUyIDE5OS45NDEsNDMuNzM3IDE5OS45NDEsNDUuOTI1IEMxOTkuOTQxLDU0Ljc2IDIwNy4xMDMsNjEuOTIyIDIxNS45MzgsNjEuOTIyIEMyMjQuNzczLDYxLjkyMiAyMzEuOTM1LDU0Ljc2IDIzMS45MzUsNDUuOTI1IEMyMzEuOTM1LDM3LjA5IDIyNC43NzMsMjkuOTI4IDIxNS45MzgsMjkuOTI4IEMyMTQuMjM3LDI5LjkyOCAyMTIuNiwzMC4xOTkgMjExLjA2MiwzMC42OTEgQzE4OC4wMjIsMTEuMDU2IDE1OC41MTMsMCAxMjgsMCBDNTcuNDIxLDAgMCw1Ny40MiAwLDEyOCBDMCwxOTguNTc5IDU3LjQyMSwyNTUuOTk5IDEyOCwyNTUuOTk5IEMxOTguNTc5LDI1NS45OTkgMjU2LDE5OC41NzkgMjU2LDEyOCBDMjU2LDExNi40MjggMjU0LjQzMywxMDQuOTEgMjUxLjMzOSw5My43NjggWiIgZmlsbD0iIzExMkI0OSIvPiYjeGE7ICAgIDwvZz4mI3hhOzwvc3ZnPg==" preserveAspectRatio="none" pointer-events="none" />
        <path d="M 250 246 L 250 246" fill="none" stroke="#66b2ff" stroke-width="3" stroke-miterlimit="10" pointer-events="none" />
        <g transform="translate(511.5,128.5)" >
            <switch>
                <foreignObject style="overflow:visible;" pointer-events="all" width="176" height="34" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility">
                    <div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 30px; font-family: Helvetica; color: rgb(255, 255, 255); line-height: 1.2; vertical-align: top; width: 178px; white-space: nowrap; overflow-wrap: normal; font-weight: bold; text-align: center;">
                        <div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;">
                            <div style="font-size: 30px">apollo-client</div>
                        </div>
                    </div>
                </foreignObject>
                <text x="88" y="32" fill="#FFFFFF" text-anchor="middle" font-size="30px" font-family="Helvetica" font-weight="bold">[Not supported by viewer]</text>
            </switch>
        </g>
        <g transform="translate(-19.5,168.5)rotate(-90,54,12.5)" class="fragment" data-fragment-index="1">
            <switch>
                <foreignObject style="overflow:visible;" pointer-events="all" width="108" height="25" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility">
                    <div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 23px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; vertical-align: top; width: 108px; white-space: nowrap; overflow-wrap: normal; font-weight: bold; text-align: center;">
                        <div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;">Vanilla JS</div>
                    </div>
                </foreignObject>
                <text x="54" y="24" fill="#000000" text-anchor="middle" font-size="23px" font-family="Helvetica" font-weight="bold">Vanilla JS</text>
            </switch>
        </g>
        <g transform="translate(-22.5,336.5)rotate(-90,62,26)" class="fragment" data-fragment-index="2">
            <switch>
                <foreignObject style="overflow:visible;" pointer-events="all" width="124" height="52" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility">
                    <div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 23px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; vertical-align: top; width: 124px; white-space: normal; overflow-wrap: normal; font-weight: bold; text-align: center;">
                        <div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;">Framework specific </div>
                    </div>
                </foreignObject>
                <text x="62" y="38" fill="#000000" text-anchor="middle" font-size="23px" font-family="Helvetica" font-weight="bold">Framework specific </text>
            </switch>
        </g>
        <rect x="163" y="331.5" width="174" height="61" rx="7" ry="7" fill="#ff9408" stroke="#c73500" transform="rotate(-90,250,362)" pointer-events="none" class="fragment" data-fragment-index="2" />
        <g transform="translate(196.5,350.5)rotate(-90,53,11.5)" class="fragment" data-fragment-index="2">
            <switch>
                <foreignObject style="overflow:visible;" pointer-events="all" width="106" height="23" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility">
                    <div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 21px; font-family: Helvetica; color: rgb(255, 255, 255); line-height: 1.2; vertical-align: top; width: 108px; white-space: nowrap; overflow-wrap: normal; text-align: center;">
                        <div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;"><b>react-relay</b></div>
                    </div>
                </foreignObject>
                <text x="53" y="22" fill="#ffffff" text-anchor="middle" font-size="21px" font-family="Helvetica">&lt;b&gt;react-relay&lt;/b&gt;</text>
            </switch>
        </g>
        <rect x="376" y="331.5" width="173" height="61" rx="7" ry="7" fill="#125775" stroke="#118583" transform="rotate(-90,462.5,362)" pointer-events="none" class="fragment" data-fragment-index="2" />
        <g transform="translate(407.5,350.5)rotate(-90,54.5,11.5)" class="fragment" data-fragment-index="2">
            <switch>
                <foreignObject style="overflow:visible;" pointer-events="all" width="109" height="23" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility">
                    <div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 21px; font-family: Helvetica; color: rgb(255, 255, 255); line-height: 1.2; vertical-align: top; width: 111px; white-space: nowrap; overflow-wrap: normal; text-align: center;">
                        <div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;">react-apollo</div>
                    </div>
                </foreignObject>
                <text x="55" y="22" fill="#ffffff" text-anchor="middle" font-size="21px" font-family="Helvetica">react-apollo</text>
            </switch>
        </g>
        <rect x="445" y="331.5" width="173" height="61" rx="7" ry="7" fill="#125775" stroke="#118583" transform="rotate(-90,531.5,362)" pointer-events="none" class="fragment" data-fragment-index="2" />
        <g transform="translate(464.5,350.5)rotate(-90,66.5,11.5)" class="fragment" data-fragment-index="2">
            <switch>
                <foreignObject style="overflow:visible;" pointer-events="all" width="133" height="23" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility">
                    <div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 21px; font-family: Helvetica; color: rgb(255, 255, 255); line-height: 1.2; vertical-align: top; width: 135px; white-space: nowrap; overflow-wrap: normal; text-align: center;">
                        <div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;">apollo-angular</div>
                    </div>
                </foreignObject>
                <text x="67" y="22" fill="#ffffff" text-anchor="middle" font-size="21px" font-family="Helvetica">apollo-angular</text>
            </switch>
        </g>
        <rect x="513.5" y="331.5" width="173" height="61" rx="7" ry="7" fill="#125775" stroke="#118583" transform="rotate(-90,600,362)" pointer-events="none" class="fragment" data-fragment-index="2" />
        <g transform="translate(551.5,350.5)rotate(-90,48.5,11.5)" class="fragment" data-fragment-index="2">
            <switch>
                <foreignObject style="overflow:visible;" pointer-events="all" width="97" height="23" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility">
                    <div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 21px; font-family: Helvetica; color: rgb(255, 255, 255); line-height: 1.2; vertical-align: top; width: 97px; white-space: nowrap; overflow-wrap: normal; text-align: center;">
                        <div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;">vue-apollo</div>
                    </div>
                </foreignObject>
                <text x="49" y="22" fill="#ffffff" text-anchor="middle" font-size="21px" font-family="Helvetica">vue-apollo</text>
            </switch>
        </g>
        <rect x="581" y="331.5" width="173" height="61" rx="7" ry="7" fill="#125775" stroke="#118583" transform="rotate(-90,667.5,362)" pointer-events="none" class="fragment" data-fragment-index="2" />
        <g transform="translate(592.5,350.5)rotate(-90,74.5,11.5)" class="fragment" data-fragment-index="2">
            <switch>
                <foreignObject style="overflow:visible;" pointer-events="all" width="149" height="23" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility">
                    <div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 21px; font-family: Helvetica; color: rgb(255, 255, 255); line-height: 1.2; vertical-align: top; width: 149px; white-space: nowrap; overflow-wrap: normal; text-align: center;">
                        <div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;">apollo-elements</div>
                    </div>
                </foreignObject>
                <text x="75" y="22" fill="#ffffff" text-anchor="middle" font-size="21px" font-family="Helvetica">apollo-elements</text>
            </switch>
        </g>
        <rect x="648.5" y="331.5" width="173" height="61" rx="7" ry="7" fill="#125775" stroke="#118583" transform="rotate(-90,735,362)" pointer-events="none" class="fragment" data-fragment-index="2" />
        <g transform="translate(673.5,350.5)rotate(-90,61.5,11.5)" class="fragment" data-fragment-index="2">
            <switch>
                <foreignObject style="overflow:visible;" pointer-events="all" width="123" height="23" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility">
                    <div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 21px; font-family: Helvetica; color: rgb(255, 255, 255); line-height: 1.2; vertical-align: top; width: 123px; white-space: nowrap; overflow-wrap: normal; text-align: center;">
                        <div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;">ember-apollo</div>
                    </div>
                </foreignObject>
                <text x="62" y="22" fill="#ffffff" text-anchor="middle" font-size="21px" font-family="Helvetica">ember-apollo</text>
            </switch>
        </g>
        <path d="M 475 226 L 475 238 L 475 263.4" fill="none" stroke="#006eaf" stroke-width="3" stroke-miterlimit="10" pointer-events="none" class="fragment" data-fragment-index="2" />
        <path d="M 475 271.65 L 469.5 260.65 L 475 263.4 L 480.5 260.65 Z" fill="#006eaf" stroke="#006eaf" stroke-width="3" stroke-miterlimit="10" pointer-events="none" class="fragment" data-fragment-index="2" />
        <path d="M 533 226 L 533 238 L 533 263.4" fill="none" stroke="#006eaf" stroke-width="3" stroke-miterlimit="10" pointer-events="none" class="fragment" data-fragment-index="2" />
        <path d="M 533 271.65 L 527.5 260.65 L 533 263.4 L 538.5 260.65 Z" fill="#006eaf" stroke="#006eaf" stroke-width="3" stroke-miterlimit="10" pointer-events="none" class="fragment" data-fragment-index="2" />
        <path d="M 599 226 L 599 238 L 599 263.4" fill="none" stroke="#006eaf" stroke-width="3" stroke-miterlimit="10" pointer-events="none" class="fragment" data-fragment-index="2" />
        <path d="M 599 271.65 L 593.5 260.65 L 599 263.4 L 604.5 260.65 Z" fill="#006eaf" stroke="#006eaf" stroke-width="3" stroke-miterlimit="10" pointer-events="none" class="fragment" data-fragment-index="2" />
        <path d="M 667 226 L 667 238 L 667 263.4" fill="none" stroke="#006eaf" stroke-width="3" stroke-miterlimit="10" pointer-events="none" class="fragment" data-fragment-index="2" />
        <path d="M 667 271.65 L 661.5 260.65 L 667 263.4 L 672.5 260.65 Z" fill="#006eaf" stroke="#006eaf" stroke-width="3" stroke-miterlimit="10" pointer-events="none" class="fragment" data-fragment-index="2" />
        <path d="M 727 226 L 727 238 L 727 263.4" fill="none" stroke="#006eaf" stroke-width="3" stroke-miterlimit="10" pointer-events="none" class="fragment" data-fragment-index="2" />
        <path d="M 727 271.65 L 721.5 260.65 L 727 263.4 L 732.5 260.65 Z" fill="#006eaf" stroke="#006eaf" stroke-width="3" stroke-miterlimit="10" pointer-events="none" class="fragment" data-fragment-index="2" />
        <path d="M 250 226 L 250 263.4" fill="none" stroke="#006eaf" stroke-width="3" stroke-miterlimit="10" pointer-events="none" class="fragment" data-fragment-index="2" />
        <path d="M 250 271.65 L 244.5 260.65 L 250 263.4 L 255.5 260.65 Z" fill="#006eaf" stroke="#006eaf" stroke-width="3" stroke-miterlimit="10" pointer-events="none" class="fragment" data-fragment-index="2" />
        <rect x="115" y="176" width="270" height="50" rx="7" ry="7" fill="#1ba1e2" stroke="#006eaf" pointer-events="none" class="fragment" data-fragment-index="1" />
        <g transform="translate(185.5,189.5)" class="fragment" data-fragment-index="1">
            <switch>
                <foreignObject style="overflow:visible;" pointer-events="all" width="128" height="23" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility">
                    <div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 21px; font-family: Helvetica; color: rgb(255, 255, 255); line-height: 1.2; vertical-align: top; width: 130px; white-space: nowrap; overflow-wrap: normal; font-weight: bold; text-align: center;">
                        <div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;">Environment</div>
                    </div>
                </foreignObject>
                <text x="64" y="22" fill="#ffffff" text-anchor="middle" font-size="21px" font-family="Helvetica" font-weight="bold">Environment</text>
            </switch>
        </g>
        <rect x="465" y="176" width="270" height="50" rx="7" ry="7" fill="#1ba1e2" stroke="#006eaf" pointer-events="none" class="fragment" data-fragment-index="1" />
        <g transform="translate(537.5,189.5)" class="fragment" data-fragment-index="1">
            <switch>
                <foreignObject style="overflow:visible;" pointer-events="all" width="124" height="23" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility">
                    <div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 21px; font-family: Helvetica; color: rgb(255, 255, 255); line-height: 1.2; vertical-align: top; width: 124px; white-space: nowrap; overflow-wrap: normal; text-align: center;">
                        <div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;"><b>ApolloClient</b></div>
                    </div>
                </foreignObject>
                <text x="62" y="22" fill="#ffffff" text-anchor="middle" font-size="21px" font-family="Helvetica">&lt;b&gt;ApolloClient&lt;/b&gt;</text>
            </switch>
        </g>
    </g>
</svg>

-----

## А теперь копнем поглубже в ядро сторов

-----

<div style="font-size: 30px; font-weight: bold; padding-bottom: 15px;">
  Найдите 5 отличий
  <br/>
  <span class="orange">relay-runtime</span> vs <span class="apollo">apollo-client</span> 
</div>

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

### Различия в подписках на изменения в сторе

- <span class="orange">Relay</span> на уровне фрагмента
- <span class="apollo">ApolloClient</span> на уровне запроса целиком

-----

### Представьте большую таблицу, если произошли изменения в сторе:

- то <span class="orange">Relay</span> отправит изменения фрагменту
- <span class="apollo">ApolloClient</span> отправит изменения всему Query

<span class="fragment"><span class="orange">Relay</span> будет перерендерить строчку, а то и ячейку. А вот <span class="apollo">ApolloClient</span> всю таблицу.</span>

<span class="fragment">Т.к. у <span class="orange">Relay</span> еcть специальный компонент <code>FragmentContainer</code></span>

-----

#### Очень показательно [issue 3965](https://github.com/apollographql/apollo-client/issues/3965), где Mike Marcacci делится опытом работы отображения объектов на карте при изменении Viewport'a:

- <span class="apollo">ApolloClient</span> – <b>"is drastically slow down"</b> 👎
- <span class="orange">Relay</span> – <b>"total lack of communication"</b> 👎

-----

## GrabageCollector

- <span class="apollo">ApolloClient</span> – завезут в v3 ([PR 4681](https://github.com/apollographql/apollo-client/pull/4681)), отполируется скорее всего к концу года.
- <span class="orange">Relay</span> – GC еще был два года назад. Но кто об этом знал?!

Пока Relay все равно будет рулить, т.к. он работает на уровне фрагментов. <!-- .element: class="fragment green" -->

-----

## А еще у <span class="orange">Relay</span> есть<br/><br/>

- `PaginationContainer` – компонента, облегчающая жизнь с [Relay Cursor Connections Spec](https://facebook.github.io/relay/graphql/connections.htm)<br/><br/>
- `FragmentContainer` – гвоздь производительности Relay, у него еще Datamasking по умолчанию

-----

### Неужели в Аполло все так плохо? <!-- .element: class="red" -->

Куча людей радуется тому, что есть.

И вполне хватает текущего поведения под их задачи.

В край не кэшируйте или чистите стор ручками, когда начнутся проблемы. <!-- .element: class="fragment green" -->

-----

## Что выбрать <span class="orange">Relay</span> или <span class="apollo">ApolloClient</span>?

![mark-almost-ready](https://user-images.githubusercontent.com/1946920/57198410-2bab4b80-6f94-11e9-9e14-6c14b8138cd7.jpg) <!-- .element: class="plain" -->

-----

### <span class="orange">Relay ~170k/week</span> <span class="apollo">ApolloClient ~650k/week</span>

[<img width="1121" alt="Screen Shot 2019-05-06 at 12 55 20 AM" src="https://user-images.githubusercontent.com/1946920/57198866-d96d2900-6f99-11e9-999d-e5b9df9ba579.png">](https://www.npmtrends.com/apollo-client-vs-relay-runtime)

-----

## Быстрое сравнение с Redux  <!-- .element: class="red" -->

- Создание стора – нет такой задачи в вашем спринте. <!-- .element: class="fragment" -->
- Нет редьюсеров. <!-- .element: class="fragment" -->
- Экшены – это GraphQL-запросы. <!-- .element: class="fragment" -->
- Коннект – это компоненты Query, Mutation, FragmentContainer и прочие хуки. <!-- .element: class="fragment" -->

<span class="fragment green">Чуть подробнее про [Redux - бойлерплейт vs Relay/ApolloClient](https://github.com/nodkz/conf-talks/tree/master/articles/redux)</span>