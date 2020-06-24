## M9: Пробрасываем токены и куки (Authorization)

-----

### Всё до безобразия просто <!-- .element: class="green" -->

- Пробрасываем http-заголовки (Authorizaition, Cookie) из ApolloServer в контекст GraphQL. <!-- .element: class="fragment" -->
- Затем этот контекст пробрасываем в axios, чтоб он мог их использовать в своих подзапросах. <!-- .element: class="fragment" -->

-----

### Боль и печаль – пришлось отредактировать больше 220 файлов. <!-- .element: class="red" -->

### Пробрасывайте сразу контекст до axios клиента! <!-- .element: class="fragment" -->

-----

### 1. На ApolloServer'е кладём `headers` в контекст

```ts
const apolloServer = new ApolloServer({
  schema,
  context: ({ req }) => {
    ctx.headers = req?.headers;
    return ctx;
  },
});

```

<span class="fragment" data-code-focus="3-6" />

-----

### 2. Во всех Entrypoints (M3) пробрасываем context

```ts
export default {
  type: TaskTC.NonNull.List,
  args: {
    ids: TaskID.NonNull.List.NonNull,
  },
  resolve: (source, args, context, info) => {
    return taskFindByIds({ ids: args.ids, info }, context);
  },
};

```

<span class="fragment" data-code-focus="6-7" />

-----

### 3. Во всех DataLoaders (M6) пробрасываем context

```ts
export function taskDL(context: any, info: GraphQLResolveInfo) {
  return new DataLoader<string, any>(async (ids) => {
    const results = await taskFindByIds({ ids, info }, context);
    return ids.map(
      (id) => results.find((x) => x.id === id) || new Error(`Task: no result for ${id}`)
    );
  });
}

```

<span class="fragment" data-code-focus="1,3" />

-----

### 4. Во всех Relations (M7) пробрасываем context

```ts
export function getRelationTaskIds(sourceFieldName: string) {
  return {
    type: () => TaskTC.NonNull.List,
    resolve: (source, _, context, info) => {
      return taskFindByIds(
        { ids: source[sourceFieldName], info },
        context,
      );
    },
  };
}

```

<span class="fragment" data-code-focus="4,7" />

-----

### Грубая оценка

- отредактировали 220 файлов
- ~ `⏱ 10 часов`
