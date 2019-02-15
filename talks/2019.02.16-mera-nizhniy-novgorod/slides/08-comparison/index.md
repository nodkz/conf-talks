# Сравнение

-----

<table style="zoom: 0.6;">
<thead>
<tr>
<th></th>
<th align="center">graphql</th>
<th align="center">graphql-tools</th>
<th align="center">graphql-compose</th>
<th align="center">type-graphql</th>
<th align="center">nexus</th>
</tr>
</thead>
<tbody><tr>
<td>Дата создания</td>
<td align="center">2012/2015</td>
<td align="center">2016.04</td>
<td align="center">2016.07</td>
<td align="center">2018.02</td>
<td align="center">2018.11</td>
</tr>
<tr>
<td>Язык для разработки схемы</td>
<td align="center">JS, TS, Flow</td>
<td align="center">JS, TS, Flow</td>
<td align="center">JS, TS, Flow</td>
<td align="center">TS</td>
<td align="center">JS, TS</td>
</tr>
<tr>
<td>Schema-first (SDL-first)</td>
<td align="center">-</td>
<td align="center">да</td>
<td align="center">да</td>
<td align="center">-</td>
<td align="center">-</td>
</tr>
<tr>
<td>Code-first</td>
<td align="center">да</td>
<td align="center">-</td>
<td align="center">да</td>
<td align="center">да</td>
<td align="center">да</td>
</tr>
<tr>
<td>Редактирование GraphQL-типов</td>
<td align="center">-</td>
<td align="center">-</td>
<td align="center">да</td>
<td align="center">-</td>
<td align="center">-</td>
</tr>
<tr>
<td>Статическая типизация в резолверах</td>
<td align="center">1/5<br/>нет</td>
<td align="center">3/5<br/>через сторонние пакеты</td>
<td align="center">2/5<br/>кроме аргументов</td>
<td align="center">5/5<br/>из коробки через рефлексию</td>
<td align="center">4/5<br/>через генерацию файлов из коробки</td>
</tr>
<tr>
<td>Простота в изучении</td>
<td align="center">3/5</td>
<td align="center">5/5</td>
<td align="center">2/5</td>
<td align="center">4/5</td>
<td align="center">4/5</td>
</tr>
<tr>
<td>Чистота в коде схемы</td>
<td align="center">1/5</td>
<td align="center">5/5</td>
<td align="center">4/5</td>
<td align="center">4/5</td>
<td align="center">3/5</td>
</tr>
<tr>
<td>Типы полей (модификатор по-умолчанию)</td>
<td align="center">optional</td>
<td align="center">optional</td>
<td align="center">optional</td>
<td align="center">Required</td>
<td align="center">Required</td>
</tr>
</tbody></table>

-----

## Required полей по-умолчанию – плохо!

<br/>

### Шаг в лево, шаг в право в данных<br/> – и все сломалось. <!-- .element: class="fragment" -->

<br/>

#### В данных! Не в схеме! ☝️ <!-- .element: class="fragment" -->

-----

Также рекомендую прочитать хорошую статью <br/>[про разницу в подходах Schema-first и Code-first](https://www.prisma.io/blog/the-problems-of-schema-first-graphql-development-x1mn4cb0tyl3)