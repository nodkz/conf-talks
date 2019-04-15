# nexus

`yarn install nexus`

-----

### [nexus](https://github.com/prisma/nexus) – декларативный конструктор схемы со встроенным генератором дефинишенов для TypeScript.

Продвигается [Prisma](https://prisma.io)'ой.

-----

### Чтобы заработали тайпинги, вы должны перезапустить сервер ☝️

- поменяли файл схемы
- перезапустили сервер
- перегенерились тайпинги
- TypeScript подхватил дефинишены типов
- TypeScript проверяет ваш код

-----

### 1. Импортируем нужные классы

```js
import { objectType, queryType, intArg, makeSchema } from 'nexus';
import { authors, articles } from './data';

```

-----

### 2. Cоздаем тип для `Автора`

```js
const Author = objectType({
  name: 'Author',
  definition(t) {
    t.int('id', { nullable: true });
    t.string('name', { nullable: true });
  },
});

```

-----

### 3. Cоздаем тип для `Статьи`

<div class="code-500">

```js
const Article = objectType({
  name: 'Article',
  definition(t) {
    t.string('title');
    t.string('text', { nullable: true });
    t.int('authorId', { description: 'Record id from Author table' });
    t.field('author', {
      nullable: true,
      type: 'Author',
      resolve: source => {
        const { authorId } = source;
        return authors.find(o => o.id === authorId) as any;
      },
    });
  },
});

```

</div>

-----

### 4. Описываем точку входа – `Query`

```js
const Query = queryType({
  definition(t) {
    t.list.field('articles', {
      nullable: true,
      type: Article,
      args: {
        limit: intArg({ default: 3, required: true })
      },
      resolve: (_, args) => {
        const { limit } = args;
        return articles.slice(0, limit);
      },
    });
    t.list.field('authors', {
      nullable: true,
      type: Author,
      resolve: () => authors,
    });
  },
});

```

<span class="fragment" data-code-focus="1" />
<span class="fragment" data-code-focus="3-13" />
<span class="fragment" data-code-focus="14-18" />

-----

### 5. Теперь можно построить экземпляр схемы

```js
const schema = makeSchema({
  types: [Query, Article, Author],
  outputs: {
    schema: __dirname + '/nexus-generated/schema.graphql',
    typegen: __dirname + '/nexus-generated/typings.ts',
  },
});

export default schema;

```

<span class="fragment fade-in-then-out" data-code-focus="2">
  Не очень удобно если в вашей схеме сотни типов.
</span>
<br/>
<span class="fragment" data-code-focus="3-6">
  Также вы обязательно должны передать пути, куда будут генерироваться тайпинги.
</span>

-----

`nexus`

Смотрите полный код примера [по ссылке](https://github.com/nodkz/conf-talks/blob/master/articles/graphql/schema-build-ways/nexus.ts)
