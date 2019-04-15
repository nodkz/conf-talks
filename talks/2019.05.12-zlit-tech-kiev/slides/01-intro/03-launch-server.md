## Запускаем сервер

![Диаграмма экосистемы](./diagram-ecosystem.svg) <!-- .element: style="width: 90vw;" class="plain"  -->

-----

### Запускаем сервер на NodeJS

```js
import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql';
import { ApolloServer } from 'apollo-server';

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      hello: {
        type: GraphQLString,
        args: {
          name: { type: GraphQLString, defaultValue: 'world' },
        },
        resolve: (source, args, context) => {
          return `Hello, ${args.name} from ip ${context.req.ip}`;
        },
      },
    },
  }),
});

const server = new ApolloServer({
  schema,
  context: ({ req }) => ({ req }),
  playground: true,
});

server
  .listen({
    port: 5000,
    endpoint: '/',
    playground: '/playground',
  })
  .then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });

```

<span class="fragment" data-code-focus="1-2" />
<span class="fragment" data-code-focus="4-18" />
<span class="fragment" data-code-focus="21-25" />
<span class="fragment" data-code-focus="27-35" />

-----

### Результат в браузере

![Launch server result](./launch-server.png)