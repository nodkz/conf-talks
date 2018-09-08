## GraphQL Types

Перед тем как строить GraphQL схему, хорошо бы разобраться из каких элментов ее можно собрать. Такими строительными элементами являются следующие типы:
- [Scalar types](#scalar-types)
- [Custom scalar types](#custom-scalar-types)
- [Object types](#object-types)
- [Input types](#input-types)
- [Enumeration types](#enumeration-types)
- [Lists and Non-Null](#lists-and-non-null)
- [Interfaces](#interfaces)
- [Union types](#union-types)

### Scalar types

Начнем с того, что в GraphQL существует 5 скалярных типов из коробки:
- `Int` - целое число (32-бита)
- `Float` - число с плавающей точкой (64-бита)
- `String` - строка d формате UTF-8
- `Boolean` - true/false
- `ID` - строка, которая является уникальным индетификатором для какого-либо типа

Негусто. Но дальше вы сможете узнать как определить свои недостающие скалярные типы.

### Custom scalar types

В GraphQL есть возможность дополнительно определить свои кастомные скалярные типы. Такие как `Date`, `Email`, `URL`, `LimitedString`, `Password`, `SmallInt` и т.п. Пример реализации таких готовых типов можно найти в гитхабе:
- https://github.com/stylesuxx/graphql-custom-types
- https://github.com/rse/graphql-tools-types

Давайте рассмотрим как объявить новый скалярный тип для GraphQL в Nodejs. Делается это довольно просто:
```js
import { GraphQLScalarType, GraphQLError } from 'graphql';

export default new GraphQLScalarType({
  // 1) --- ОПРЕДЕЛЯЕМ МЕТАДАННЫЕ ТИПА ---
  // У каждого типа, должно быть уникальное имя
  name: 'DateTimestamp',
  // Хорошим тоном будет предоставить описание для вашего типа, чтобы оно отображалось в документации
  description: 'A string which represents a HTTP URL', 
  
  // 2) --- ОПРЕДЕЛЯЕМ КАК ТИП ОТДАВАТЬ КЛИЕНТУ ---
  // Чтобы передать клиенту в GraphQL-ответе значение вашего поля
  // вам необходимо определить функцию `serialize`, 
  // которая превратит значение в допустимый json-тип
  serialize: (v: Date) => v.getTime(), // return 1536417553

  // 3) --- ОПРЕДЕЛЯЕМ КАК ТИП ПРИНИМАТЬ ОТ КЛИЕНТА ---
  // Чтобы принять значение от клиента, провалидировать его и преобразовать
  // в нужный тип/объект для работы на сервере вам нужно определить две функции:

  // 3.1) первая это `parseValue`, используется если клиент передал значение через GraphQL-переменную:
  // {
  //   variableValues: { "date": 1536417553 }
  //   source: `query ($date: DateTimestamp) { setDate(date: $date) }`
  // }
  parseValue: (v: integer) => new Date(v), 

  // 3.2) вторая это `parseLiteral`, используется если клиент передал значение в теле GraphQL-запроса:
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

  // Чтобы детальнее разобраться в работе методов `serialize`, `parseValue` и `parseLiteral` 
  // вы можете скопировать следующий файл с тестами и уже погонять на нем свои сценарии:
  // https://github.com/graphql-compose/graphql-compose/blob/master/src/type/__tests__/parseLiteral-test.js
});
```

В качестве интересного примера, вы можете посмотреть на реализацию MIXED типа - [GraphQLJSON](https://github.com/taion/graphql-type-json). Он принимает любое значение и также его возвращает, будь то число, строка, массив или сложный объект. Прекрасный лайфхак для передачи или получения значений с неизвестной заранее типом.

Таким образом GraphQL позволяет определить свои кастомные скалярные типы, который будут знать: 
- как полученное от клиента значение провалидировать и преобразовать для дальнейшей работы на стороне сервера,
- так и превратить его обратно в допустимый json-тип для передачи в GraphQL-ответе.

### Object types

### Input types

### Enumeration types

### Lists and Non-Null

### Interfaces

### Union types