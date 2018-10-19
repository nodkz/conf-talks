# GraphQL-типы

-----

### GraphQL-схема содержит в себе описания всех типов, полей и методов получения данных.

-----

## GraphQL-тип содержит в себе поля

## Поля содержат в себе GraphQL-тип

-----

#### Тип — Поля — Тип — Поля — Тип — Поля — ...

Думаете все так просто? 🤔 <!-- .element: class="fragment" -->

Конечно просто! <!-- .element: class="fragment" -->

Через месяц другой использования GraphQL <br /> 😈 <!-- .element: class="fragment" -->

### Погнали ускорять понимание! <!-- .element: class="fragment" -->

-----

## Есть две группы типов:

- Output — для вывода данных
- Input — для ввода данных

А еще модификаторы и аннотации 🤯 <!-- .element: class="fragment" -->

-----

### Система типов состоит из:

- Scalar types (Output, Input) <!-- .element: class="fragment" -->
- Custom scalar types (Output, Input) <!-- .element: class="fragment" -->
- Object types (только Output) <!-- .element: class="fragment" -->
- Input types (только Input) <!-- .element: class="fragment" -->
- Enumeration types (Output, Input) <!-- .element: class="fragment" -->
- Lists and Non-Null (модификаторы типов для Output, Input) <!-- .element: class="fragment" -->
- Interfaces (только Output) <!-- .element: class="fragment" -->
- Union types (только Output) <!-- .element: class="fragment" -->
- Root types (только Output) <!-- .element: class="fragment" -->
- Directives (аннотации для типов и рантайма) <!-- .element: class="fragment" -->

-----

### Вся система типов очень подробно и доходчиво

### [расписана у меня в гитхабе](https://github.com/nodkz/conf-talks/blob/master/particles/graphql/types/README.md)

### на русском! 😃 <!-- .element: class="fragment" -->

#### <br /> Cпециально для вас в рамках подготовки к HolyJS <!-- .element: class="fragment" -->

-----

## Scalar types

## 5 базовых скалярных типов

- `GraphQLInt` — целое число
- `GraphQLFloat` — число с плавающей точкой
- `GraphQLString` — строка в формате UTF-8
- `GraphQLBoolean` — true/false
- `GraphQLID` — строка; уникальный индетификатор

-----

## Custom scalar types

Не хватает скалярных типов?

Date, Email, URL, LimitedString, Password, SmallInt ...

<br/>

Их можно объявить самостоятельно! <!-- .element: class="fragment" -->

-----

#### Объявляем свой Custom scalar type

<pre><code>import { GraphQLScalarType, GraphQLError } from 'graphql';

export default new GraphQLScalarType({
  // 1) --- ОПРЕДЕЛЯЕМ МЕТАДАННЫЕ ТИПА ---
  // У каждого типа, должно быть уникальное имя
  name: 'DateTimestamp',
  // Хорошим тоном будет предоставить описание для вашего типа, 
  // чтобы оно отображалось в документации
  description: 'A string which represents a HTTP URL',
  
  // 2) --- ОПРЕДЕЛЯЕМ КАК ТИП ОТДАВАТЬ КЛИЕНТУ ---
  // Чтобы передать клиенту в GraphQL-ответе значение вашего поля
  // вам необходимо определить функцию `serialize`,
  // которая превратит значение в допустимый json-тип
  serialize: (v: Date) => v.getTime(), // return 1536417553

  // 3) --- ОПРЕДЕЛЯЕМ КАК ТИП ПРИНИМАТЬ ОТ КЛИЕНТА ---
  // Чтобы принять значение от клиента, провалидировать его и преобразовать
  // в нужный тип/объект для работы на сервере вам нужно определить две функции:

  // 3.1) первая это `parseValue`, используется если клиент
  // передал значение через GraphQL-переменную:
  // {
  //   variableValues: { "date": 1536417553 }
  //   source: `query ($date: DateTimestamp) { setDate(date: $date) }`
  // }
  parseValue: (v: integer) => new Date(v),

  // 3.2) вторая это `parseLiteral`, используется если клиент 
  // передал значение в теле GraphQL-запроса:
  // {
  //   source: `query { setDate(date: 1536417553) }`
  // }
  parseLiteral: (ast) => {
    if (ast.kind === Kind.STRING) {
      throw new GraphQLError('Field error: value must be Integer');
    } else if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10)); // ast value is always in string format
    }
    return null;
  },
});
</code></pre>

1. Определяем метаданные типа
2. Как сериализуем для отправки клиенту
3. Как де-сериализуем значение от клиента
  
<span class="fragment" data-code-focus="1-3" />
<span class="fragment" data-code-focus="4" />
<span class="fragment" data-code-focus="5-9" />
<span class="fragment" data-code-focus="11" />
<span class="fragment" data-code-focus="12-15" />
<span class="fragment" data-code-focus="17-19" />
<span class="fragment" data-code-focus="21-27" />
<span class="fragment" data-code-focus="29-41" />

-----

#### Все типы в рамках GraphQL-схемы должны иметь уникальные имена.

#### Не должно быть двух разных типов с одним именем.

-----