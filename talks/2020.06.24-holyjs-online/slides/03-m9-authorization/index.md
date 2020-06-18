## M9: Пробрасываем токены и куки (Authorization)

-----

- Пробрасываем Authorizaition заголовок, а также куки (на вырост) в контекст. Затем этот контекст пробрасываем в axios, чтоб он мог их использовать в своих подзапросах.

-----

### Боль и печаль – пришлось отредактировать больше 220 файлов.

### Пробрасывайте сразу `headers` из запроса GraphQL в axios клиента.

-----

### 1. На ApolloServer'е ложим `headers` в контекст

```ts
const apolloServer = new ApolloServer({
  schema,
  context: ({ req }) => {
    ctx.headers = req?.headers;
    return ctx;
  },
});
```

-----

### 2. Во всех Entrypoints (M3) пробрасываем context

# TODO: дописать

-----

### 3. Во всех DataLoaders (M6) пробрасываем context

# TODO: дописать

-----

### 4. Во всех Relations (M7) пробрасываем context

# TODO: дописать

-----

### Грубая оценка

- отредактировали 220 файлов
- ~ `⏱ 10 часов`
