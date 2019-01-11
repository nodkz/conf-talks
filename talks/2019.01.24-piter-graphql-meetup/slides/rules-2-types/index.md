# 2. Правила типов

-----

## [Rule 2.1.](https://github.com/nodkz/conf-talks/tree/master/articles/graphql/schema-design#rule-2.1)

## Используйте кастомные скалярные типы, если вы хотите объявить поля или аргументы с определенным семантическим значением.

-----

## Есть 5 стандартных скалярных типов

### `String`  `Int`  `Float`  `Boolean`  `ID`

## <br/>Жить можно, но как <br />с Эллочкой-людоедочкой... <!-- .element: class="fragment" -->

-----

### Дату назовите датой

```diff
type Article {
-  createdAt: String
+  createdAt: Date
}

```

<br/>

### HTML назовите хтмл'ом

```diff
type Article {
-  description: String
+  description: HTML
}

```

-----

## Что дают свои кастомные скаляры?

- `Бэкедерам` – единожды написать методы валидации, (де-)сериализации и `не гадить в resolve`-методах<br/><br/>

- `Фронтендерам` – написать компоненты для ввода/ввывода данных и `не гадать о формате` данных

-----

## [Rule 2.2.](https://github.com/nodkz/conf-talks/tree/master/articles/graphql/schema-design#rule-2.2)

## Используйте Enum для полей, которые содержат определенный набор значений.

-----

### Определенный набор значений, через ENUM

```diff
type User {
-  gender: String # BAD
+  gender: GenderEnum # GOOD
}

+ enum GenderEnum {
+   MALE
+   FEMALE
+ }

```

-----

## Что дают ENUM-типы?

- `Бэкедерам`
  - валидация значений из коробки
  - экономия на документации

- `Фронтендерам`
  - не гадать о доступных значениях
  - проверки запросов линтерам
  - проверка кода статическими анализаторами
