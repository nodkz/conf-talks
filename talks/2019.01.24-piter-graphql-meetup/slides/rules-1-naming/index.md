# 1. Правила именования

-----

## `/[_A-Za-z][_0-9A-Za-z]*/`

### маска имен в GraphQL для типов и полей.

### Она позволяет использовать: <!-- .element: class="fragment" -->

- camelCase <!-- .element: class="fragment" -->
- under_score <!-- .element: class="fragment" -->
- UpperCamelCase <!-- .element: class="fragment" -->
- CAPITALIZED_WITH_UNDERSCORES <!-- .element: class="fragment" -->
- <span>слава богу `kebab-case` не поддерживается!</span> <!-- .element: class="fragment" -->

-----

## [Rule 1.1.](https://github.com/nodkz/conf-talks/tree/master/articles/graphql/schema-design#rule-1.1) <!-- .element: target="_blank"  -->

## Используйте `camelCase` для именования GraphQL-полей и аргументов.

-----

### Имя поля

```diff
type User {
-  in_active: boolean # BAD
+  isActive: boolean # GOOD
}

```

### Имя аргумента

```diff
type Query {
-  users(per_page: Int): boolean # BAD
+  users(perPage: Int): boolean # GOOD
}

```

-----

## Почему `camelCase` <br/>для полей и аргументов?

### <br/>Конвенция по именованию переменных <br />согласно [википедии](https://en.wikipedia.org/wiki/Naming_convention_(programming)):

- JavaScript — `camelCase`
- Java — `camelCase`
- Swift — `camelCase`
- Kotlin — `camelCase`

-----

## [Rule 1.2.](https://github.com/nodkz/conf-talks/tree/master/articles/graphql/schema-design#rule-1.2) <!-- .element: target="_blank"  -->

## Используйте `UpperCamelCase` для именования GraphQL-типов.

-----

### Имя типа

```diff
- type userFilter { # BAD
- type User_Filter { # so-so
+ type UserFilter { # GOOD
    isActive: boolean
  }

```

-----

## Почему `UpperCamelCase` <br/>для именования типов?

- [конвенции в JavaScript, Java, Swift и Kotlin](https://en.wikipedia.org/wiki/Naming_convention_(programming)) для классов и деклараций типов используется `UpperCamelCase`
- встроенные GraphQL-типы уже `UpperCamelCase`
- в Flowtype и TypeScript тоже `UpperCamelCase`

-----

## [Rule 1.3.](https://github.com/nodkz/conf-talks/tree/master/articles/graphql/schema-design#rule-1.3) <!-- .element: target="_blank"  -->

## Используйте `CAPITALIZED_WITH_UNDERSCORES` для именования значений ENUM-типов.

-----

### Значения для ENUM-типов

```diff
enum Sort {
-  nameAsc # BAD
-  NameAsc # BAD
+  NAME_ASC # GOOD
   NAME_DESC
   AGE_ASC
   AGE_DESC
}

```

-----

## Почему `CAPITALIZED_WITH_UNDERSCORES` <br/>для значений ENUM-типов?

- [конвенции в Java и Kotlin](https://en.wikipedia.org/wiki/Naming_convention_(programming)) для констант
- существующие GraphQL-enum `SCALAR`, `OBJECT`, `INPUT_OBJECT`, `NON_NULL` и др.

-----

### И не забываем про то, как будут использоваться ENUM значения в GraphQL-запросах

```diff
query {
-  findUser(sort: idDesc) { # BAD
+  findUser(sort: ID_DESC) { # GOOD
     id
     name
   }
}

```

-----

## TL;DR по именованию:

- `camelCase` – для полей и аргументов
- `UpperCamelCase` – для типов
- `CAPITALIZED_WITH_UNDERSCORES` – для ENUM-значений
