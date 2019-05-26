
# GraphQL должен быть <span class="red">«волосатым»</span>

-----

<a href="https://user-images.githubusercontent.com/1946920/57199292-26073300-6f9f-11e9-886d-0cd8d84eac16.png" target="_blank"><img style="width: 400px;" class="plain" alt="Screen Shot 2019-05-19 at 12 45 39 AM" src="https://user-images.githubusercontent.com/1946920/57974374-d3833900-79d8-11e9-9302-1ec7e530bea8.png">
</a>

-----

## Волосатость лучше начать объяснять с вводом термина <span class="red">RestQL</span>...

-----

## <span class="red">RestQL</span> – это GraphQL от бэкендшиков с RESTом головного мозга

-----

## <span class="red">RestQL</span> – это апи слабыми связями

-----

### <span class="red">RestQL</span> – это когда бэкендер не описал все связи между типами

<span>И фронтендерам надо самим догадыватся, как запросить нужные `related data`</span> <!-- .element: class="fragment" -->

-----

## У Фронтендера должна быть возможность <span class="green">сходить по маленькому...</span>

<h2 class="fragment"><span class="green">...кругу</span> через Фрагменты, чтобы получить необходимые данные.</h2>

-----

## А при слабых связях, Фронтендер вынужден <span class="red">ходить по большому...</span>

<h2 class="fragment"><span class="red">...кругу</span> через отдельный Запрос, чтобы получить необходимые данные.</h2>

-----

## Визуально «волосатость» GraphQL можно увидеть через <!-- .element: class="orange" -->

## <https://apis.guru/graphql-voyager/>

### (by Ivan Goncharov & Roman Hotsiy)

-----

#### «Волосатое» GraphQL API гитхаба  👍 <!-- .element: class="green" -->

![hairly-github](https://user-images.githubusercontent.com/1946920/57200267-b0ee2a80-6fab-11e9-9c76-6053abe48ecd.jpg)

-----

#### Кусочек «лысого» RestQL API 👎 <!-- .element: class="red" -->

![hairly-amazon](https://user-images.githubusercontent.com/1946920/57200270-b3e91b00-6fab-11e9-9d65-e6f794ea42f5.jpg) <!-- .element: style="max-width: 600px" -->

-----

## Если ваши бэкендеры запилили <span class="red">«лысый» GraphQL</span> – то в полную силу вы <span class="red">фрагментами уже не воспользуетесь</span>

-----

## Концептуальная разница GraphQL и REST API в том,

## что реализацию логики получения связанных ресурсов перенесли с клиента на сервер. <!-- .element: class="fragment green" -->

Сняли жуткий головняк с фронтендеров 👍 <!-- .element: class="fragment" -->

-----

#### Вот собственно и всё, что надо знать про <span class="red">«волосатый»</span> GraphQL

#### Всем добрых и пушистых бэкендеров 😉 <!-- .element: class="fragment green" -->

<a href="https://user-images.githubusercontent.com/1946920/57199295-299aba00-6f9f-11e9-9f42-29c9ad6f2993.png" target="_blank">
<img style="width: 700px;" class="plain" alt="Screen Shot 2019-05-19 at 12 40 32 AM" src="https://user-images.githubusercontent.com/1946920/57974370-cf571b80-79d8-11e9-9ef3-d6aa23d5c2a5.png">
</a>