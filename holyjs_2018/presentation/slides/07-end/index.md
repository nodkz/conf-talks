# The End!!

Thank you

<pre><code data-trim>
import { makeExecutableSchema } from 'graphql-tools';
import { authors, articles } from './data';

const typeDefs = `
  "Author data"
  type Author {
    id: Int
    name: String
  }

  "Article data with related Author data"
  type Article {
    title: String!
    text: String
    "Record id from Author table"
    authorId: Int!
    author: Author
  }

  type Query {
    articles(limit: Int = 10): [Article]
    authors: [Author]
  }
`;
</code></pre>

<span class="fragment" data-code-focus="1" />
<span class="fragment" data-code-focus="14-15" />

-----
<!-- .slide: data-background="#ff0000" -->

# The End!

Thank you <!-- .element: class="fragment" -->

<a href="#/1">123</a>

<video controls>
  <source data-src="http://clips.vorwaerts-gmbh.de/VfE_html5.mp4" type="video/mp4" />
</video>

<div style="transform: rotate(24deg); position: absolute;     top: 107px;">
  <h1>Проверка</h1>
</div>