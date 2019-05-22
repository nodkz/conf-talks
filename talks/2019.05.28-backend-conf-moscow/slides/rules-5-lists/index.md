# 5. Правила списков

-----

## [Rule 5.1.](https://github.com/nodkz/conf-talks/tree/master/articles/graphql/schema-design#rule-5.1)

## Для фильтрации списков используйте аргумент `filter`, который содержит в себе все доступные фильтры.

-----

## Почему `filter`?

#### а не `where`, `condition`, `f`

<br/><br/>

Есть SQL, noSQL, кэши, сервисы и экзотические базы.

**самым адекват — `filter`**

-----

### Сгруппировали все аргументы фильтрации

```diff
type Query {
-  articles(authorId: Int, tags: [String], lang: LangEnum): [Article]
+  articles(filter: ArticleFilter): [Article]
}

+ input ArticleFilter {
+   authorId: Int
+   tags: [String]
+   lang: LangEnum
+ }

```

-----

## Зачем?

- вдруг приспичит: сортировка, лимит, офсет, номер страницы, курсор, язык и прочее
- на клиенте для статического анализа вы получите `ArticleFilter` тип для провки фильтров
- этот фильтр можно `переиспользовать` несколько раз, если список можно запросить из нескольких мест

-----

## [Rule 5.2.](https://github.com/nodkz/conf-talks/tree/master/articles/graphql/schema-design#rule-5.2)

## Для сортировки списков используйте аргумент `sort`, который должен быть `Enum` или `[Enum!]`.

-----

## Имя `sort` лучше чем

### порядок и заказ

### `order`, `orderBy`

-----

```diff
type Query {
-  articles(sort: String):             [Article]  # BAD
-  articles(sort: ArticleSortInput):   [Article]  # BAD
+  articles(sort: ArticleSortEnum):    [Article]
+  articles(sort: [ArticleSortEnum!]): [Article]
}

- input ArticleSortInput {
-   field: SortFieldsEnum
-   order: AscDescEnum
- }

+ enum ArticleSortEnum {
+   ID_ASC, ID_DESC, TEXT_MATCH, CLOSEST
+ }

```

-----

## Enum для сортировки хорошо!

- ограниченный набор значений (статический анализ)
- на сервере enum-ключ `ID_ASC` может автоматом конвертиться в enum-значение `id ASC` или `{ id: 1 }`
- подходит для экзотических сортировок TEXT_MATCH, CLOSEST и пр.

-----

## [Rule 5.3.](https://github.com/nodkz/conf-talks/tree/master/articles/graphql/schema-design#rule-5.3)

## Для ограничения возвращаемых элементов в списке используйте аргументы `limit` со значением по-умолчанию и `skip`.

-----

```graphql
type Query {
  articles(
    limit: Int! = 20
    skip: Int
  ): [Article]
}

```

- `skip` – обычный `Int`
- `limit` – чуть хитрее `Int! = 20`
  - значение по-умолчанию, чтоб клиент мог не указывать
  - NonNull, чтоб нельзя было передать `null` ☝️

-----

## [Rule 5.4.](https://github.com/nodkz/conf-talks/tree/master/articles/graphql/schema-design#rule-5.4)

## Для пагинации используйте аргументы `page`, `perPage` и возвращайте output-тип с полями `items` с массивом элементов и `pageInfo` с мета-данными для удобной отрисовки страниц на клиенте.

-----

## Пагинация (аргументы и payload)

```graphql
type Query {
  articles(
    page: Int! = 1
    perPage: Int! = 20
  ): ArticlePagination
}

type ArticlePagination {
  items: [Article]!
  pageInfo: PaginationInfo!
}

```

#### Пагинация возвращает 2 поля

- `items` – NonNull-массив элементов
- `pageInfo` – NonNull-объект с мета-данными пагинации

-----

### `PaginationInfo` – общий тип с мета-данными для пагинации

```graphql
type PaginationInfo {
  totalItems: Int!          # Total number of items
  totalPages: Int!          # Total number of pages
  page: Int!                # Current page number (starts from 1)
  perPage: Int!             # Number of items per page
  hasNextPage: Boolean!     # When paginating forwards, are there more items?
  hasPreviousPage: Boolean! # When paginating backwards, are there more items?
}

```

### Сакральный смысл всех этих полей, чтоб легко можно было отрендерить пагинацию на клиенте.

-----

**Представьте себе лагающий интернет и нервного пользователя**, который в пагинации успел щелкнуть 50 раз по разным страницам за 5 секунд.

### Что прилетит на рендеринг? <!-- .element: class="orange fragment" -->

## Без поллитра, либо мета-инфы от сервера не разобраться! <!-- .element: class="red fragment" -->

-----

## [Rule 5.5.](https://github.com/nodkz/conf-talks/tree/master/articles/graphql/schema-design#rule-5.5)

## Для бесконечных списков (infinite scroll) используйте [Relay Cursor Connections Specification](https://facebook.github.io/relay/graphql/connections.htm).

-----

### Правда вид (вложенность) у такой пагинации в запросах не очень:

```graphql
{
  articles(first: 10, after: "opaqueCursor") {
    edges {
      cursor
      node { # только на 3-уровне вложенности получаем данные записи
        id
        name
      }
    }
    pageInfo {
      hasNextPage
    }
  }
}

```

Плюс есть проблемы с SEO у курсорных списков

-----

### Но зато Relay Cursor Connections Specification

- не имеет проблем с постраничным `over-fetching`ом
- не имеет проблем с постраничным `under-fetching`ом

-----

## Листалка строится на курсорах

```graphql
{
  articles(first: 10, after: "opaqueCursor") {
    edges {
      cursor # <--- используется для следующего запроса
      node {
        name
      }
    }
  }
}

```

<span class="fragment" data-code-focus="2,4" />