# 3. Правила полей (Output)

---

## [Rule 3.1.](https://github.com/nodkz/conf-talks/tree/master/articles/graphql/schema-design#rule-3.1)

## Давайте полям понятные смысловые имена, а не то, как они реализованы у вас в базе данных.

---

### Называйте поля красиво и понятно

```diff
type Meeting {
-  body_htML: String # BAD
+  description: HTML # GOOD
}

```

---

## Чтоб не было стыдно 😳

#### [перед доном Педро](https://pikabu.ru/story/anekdot_3660462)

---

### Ваше GraphQL API – это<br/>фронтенд бэкенда для Фронтендеров.

![img](./front-back.jpg) <!-- .element: class="plain" style="max-width: 300px"  -->

---

## [Rule 3.2.](https://github.com/nodkz/conf-talks/tree/master/articles/graphql/schema-design#rule-3.2)

## Делайте поля обязательными `NonNull`, если данные в поле возвращаются при любой ситуации.

---

### Помечая поля как `NonNull`, при статическом анализе кода позволяет фронтендерам делать меньше проверок.

---

### 3 состояния у `boolean`

```graphql
type MyBool {
  bool1: Boolean # true, false, null
  bool2: Boolean! # true, false         <-- BETTER!
}
```

### Массивы – `null` снаружи и внутри

```graphql
type MyLists {
  list1: [String] # [], [null], null
  list2: [String]! # [], [null]
  list3: [String!] # [], null
  list4: [String!]! # []                <-- BETTER!
}
```

---

## [Rule 3.3.](https://github.com/nodkz/conf-talks/tree/master/articles/graphql/schema-design#rule-3.3)

## Группируйте взаимосвязанные поля вместе в новый output-тип.

---

## Принимаем жалобы либо по телефону, либо по почте

```graphql
type Claim {
  text: String!
  phone: String
  operatorCode: String
  email: String
}
```

<span class="fragment" data-code-focus="4">
  <code>operatorCode</code> всегда есть, если жалобу оставили по телефону. И всегда пустое, если по почте.
</span>

---

```graphql
type Claim {
  text: String
  byPhone: ClaimByPhone
  byMail: ClaimByMail
}

type ClaimByPhone {
  phone: String!
  operatorCode: String!
}

type ClaimByMail {
  email: String!
}
```

<code>phone</code> + <code>operatorCode</code> группируем в под-тип <code>ClaimByPhone</code>

<span class="fragment">И можем теперь поля сделать обязательными <code>NonNull</code>!</span>

---

## Группировка взаимосвязанных полей

- облегчает восприятие связей между полями
- позволяет схему сделать более строгой
