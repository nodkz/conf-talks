# GraphQL-сервер

-----

### Пакет `graphql` ничего не знает о сети, авторизации, не слушает никакой порт.

<pre><code>import { graphql } from 'graphql';
import { schema } from './your-schema';

const query = '{ hello }';
const result = await graphql(schema, query);
</code></pre>

### Всё это дело реализуется на другом уровне абстракции — GraphQL сервере.
