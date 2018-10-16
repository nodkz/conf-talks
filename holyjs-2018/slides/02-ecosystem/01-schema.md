# GraphQL Schema

-----

# GraphQL Schema — это

### описание ваших типов данных на сервере, <!-- .element: class="fragment" -->

### связей между ними <!-- .element: class="fragment" -->

### и логики получения этих самых данных. <!-- .element: class="fragment" -->

-----

## GraphQL-схема это точка входа, это корень всего вашего API.

-----

### Правда у этого корня три "головы":

- `query` — для операций получения данных
- `mutation` — для операций изменения данных
- `subscription` — для подписки на события

-----

##### Hello world schema (build phase)

<pre><code data-trim>
import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql';

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      hello: {
        type: GraphQLString,
        resolve: () => 'world',
      }
    }
  }),
  // mutation: { ... },
  // subscription: { ... },
});
</code></pre>

-----

##### Hello world schema (runtime phase)

<pre><code data-trim>
import { graphql } from 'graphql';
import { schema } from './your-schema';

const query = '{ hello }';
const result = await graphql(schema, query);

// returns: { data: { hello: "world" } }
</code></pre>

##### Запрос выполняется методом graphql() который: <!-- .element: class="fragment" -->

- производит парсинг GraphQL-запроса <!-- .element: class="fragment" -->
- производит валидацию запроса на соответствие GraphQL-схемы <!-- .element: class="fragment" -->
- выполняет запрос, пробегаясь по дереву схемы <!-- .element: class="fragment" -->
- валидирует возвращаемый ответ <!-- .element: class="fragment" -->

-----

## GraphQL по натуре строго типизированный

## Шаг влево, шаг вправо от схемы — <!-- .element: class="fragment" -->

# РАССТРЕЛ ☠️ <!-- .element: class="fragment" -->
