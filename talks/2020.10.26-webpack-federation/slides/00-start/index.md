<table>
  <tr>
    <td style="vertical-align: middle">
        <div style="vertical-align: text-top;">
        <h2>
          <span class="orange">Революция в микрофронтендах,</span>
          <br/>
          <span class="green">Module Federation,</span>
        <h2>
        <h3>
          <span>Webpack 5</span>
        </h3>
        <h4><a href="http://bit.ly/module-federation" target="_blank">http://bit.ly/module-federation</a></h4>
        <hr/>
        <h4>🇰🇿 Павел Черторогов</h4>
        <h4>🇺🇸 Paul Damnhorns</h4>
        <h4><img src="../assets/logo/twitter.png" style="height: 70px;border: none;background: none;box-shadow: none;float: left;margin: 0 11px;position: relative;top: -11px;" /> <a href="https://twitter.com/nodkz" target="_blank">@nodkz</a></h4>
      </div>
    </td>
    <td>
      <!-- QRCode generator: http://goqr.me/#t=url -->
      <img src="slides/00-start/qrcode.png" alt="QRCode" class="plain" style="max-width: 450px" />
    </td>
  </tr>
</table>

---

## Коротко о себе

- В веб-разработке с 2001 года (ужос 19 лет мучений) 🙀
- Фронтендер и бэкендер в одном флаконе 💑 <!-- .element: class="fragment" -->
- С нуля до продакшена вывел 9 продуктов ✈️ <!-- .element: class="fragment" -->

-----

## Мой OpenSource

- [graphql-compose](https://github.com/graphql-compose/graphql-compose) — генерация GraphQL-схем <br/> ![GitHub stars](https://img.shields.io/github/stars/graphql-compose/graphql-compose.svg?color=lightgrey) <!-- .element: class="plain" style="padding-left: 150px; height: 40px; vertical-align: middle;" --> ![Downloads](https://img.shields.io/npm/dw/graphql-compose.svg?color=lightgrey) <!-- .element: class="plain" style="height: 40px; vertical-align: middle;" --> ![Sponsors](https://img.shields.io/opencollective/all/graphql-compose?color=lightgrey) <!-- .element: class="plain" style="height: 40px; vertical-align: middle;" -->
- [mongodb-memory-server](https://github.com/nodkz/mongodb-memory-server) — MongoDB для тестов <br/> ![GitHub stars](https://img.shields.io/github/stars/nodkz/mongodb-memory-server.svg?color=lightgrey) <!-- .element: class="plain" style="padding-left: 150px; height: 40px; vertical-align: middle;"  --> ![Downloads](https://img.shields.io/npm/dw/mongodb-memory-server.svg?color=lightgrey) <!-- .element: class="plain" style="height: 40px; vertical-align: middle;" -->
- [lvovich](https://github.com/nodkz/lvovich) — склонение городов (from, to, in)<br/> ![GitHub stars](https://img.shields.io/github/stars/nodkz/lvovich.svg?color=lightgrey) <!-- .element: class="plain" style="padding-left: 150px; height: 40px; vertical-align: middle;" --> ![Downloads](https://img.shields.io/npm/dw/lvovich.svg?color=lightgrey) <!-- .element: class="plain" style="height: 40px; vertical-align: middle;" -->
- [react-relay-network-layer](https://github.com/relay-tools/react-relay-network-layer) — NetworkLayer для Relay <br/> ![GitHub stars](https://img.shields.io/github/stars/relay-tools/react-relay-network-layer.svg?color=lightgrey) <!-- .element: class="plain" style="padding-left: 150px; height: 40px; vertical-align: middle;"  --> ![Downloads](https://img.shields.io/npm/dw/react-relay-network-layer.svg?color=lightgrey) <!-- .element: class="plain" style="height: 40px; vertical-align: middle;" -->
- и россыпь других

-----

## Сейчас в ps.kz <!-- .element: class="orange" -->

### (казахстанской хостинговой компании)<br/>строим облачный хостинг <br/>и консоль к нему на GraphQL 👌

![ps-logo](https://user-images.githubusercontent.com/1946920/57164502-21634300-6e16-11e9-8c45-6d10fe9dea4e.jpg) <!-- .element: style="max-width: 1000px;" class="plain"  -->

-----

## Обычно я рассказываю про GraphQL <!-- .element: class="green" -->

-----

### Но не смог пройти мимо инструмента, <br/> который встряхнет индустрию веб разработки –

# Module Federation <!-- .element: class="orange fragment" -->

-----

### Что будет в докладе? <!-- .element: class="green" -->

1. Проблемы большого фронтенда <!-- .element: class="fragment" -->
2. Что такое микрофронтенды? <!-- .element: class="fragment" -->
3. Существующие решения <!-- .element: class="fragment" -->
4. Описание Module Federation <!-- .element: class="fragment" -->
5. Архитектура Module Federation <!-- .element: class="fragment" -->
6. Демо <!-- .element: class="fragment" -->
7. Минусы Module Federation <!-- .element: class="fragment" -->
8. Будущее NextJS <!-- .element: class="fragment" -->
9. Полезные ссылки <!-- .element: class="fragment" -->

-----

## Сперва короткое Демо, <br/>чтобы заинтриговать <!-- .element: class="green" -->

-----

## Про Module Federation буду рассказывать минут через 20, <br/>ищите слайд 6.1 <!-- .element: class="orange" -->
  
### А пока немного теории и предыстории <br/>для общего понимания. <!-- .element: class="orange" -->
