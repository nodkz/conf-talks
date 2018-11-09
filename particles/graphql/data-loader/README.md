# // TODO: add russian letters here

GraphQL query:

```graphql
{
  articles {
    title
    author {
      name
    }
  }
}
```

Without DataLoader (run server.js):

```text
Run Article query: findMany()
Run Author query: findById(1)
Run Author query: findById(7)
Run Author query: findById(6)
Run Author query: findById(3)
Run Author query: findById(4)
Run Author query: findById(5)
Run Author query: findById(6)
Run Author query: findById(7)
Run Author query: findById(3)
Run Author query: findById(2)
Run Author query: findById(5)
Run Author query: findById(4)
Run Author query: findById(2)
Run Author query: findById(1)
Run Author query: findById(1)
```

With DataLoader (run dl-server.js):

```text
Run Article query: findMany()
Run Author query: findByIds(1, 7, 6, 3, 4, 5, 2)
```
