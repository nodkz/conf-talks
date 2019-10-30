# Ошибки фронтендера

-----

## Ошибка 1: Нельзя переиспользовать фрагменты <!-- .element: class="red" -->

-----

### Дано: два компонента используют один набор данных `url` и `alt`

#### AvatarRound.jsx <!-- .element: class="gray" -->

```js
export default function AvatarRound(props) {
  return <img src={props.url} alt={props.alt} className="round"></img>
}

```

#### AvatarInfo.jsx <!-- .element: class="gray" -->

```js
export default function AvatarInfo(props) {
  return <span>{props.url} ({props.alt})</span>;
}

```

-----

#### Ошибка: использовать общий фрагмент для двух компонент <!-- .element: class="red" -->

#### Avatar_data.graphql <!-- .element: class="gray" style="line-height: 0.8" -->

```js
export const fragment = gql`fragment Avatar_data on Image {
  url
  alt
}`;

```

#### AvatarRound.jsx <!-- .element: class="gray" style="line-height: 0.8" -->

```js
import { fragment } from './Avatar_data.graphql';

export default function AvatarRound(props) {
  return <img src={props.url} alt={props.alt} className="round"></img>
}

```

#### AvatarInfo.jsx <!-- .element: class="gray" style="line-height: 0.8" -->

```js
import { fragment } from './Avatar_data.graphql';

export default function AvatarInfo(props) {
  return <span>{props.url} ({props.alt})</span>;
}

```

-----

#### Решение: завести свой фрагмент для каждого компонента <!-- .element: class="green" -->

#### AvatarRound.jsx <!-- .element: class="gray" style="line-height: 0.8" -->

```js
const fragment = gql`fragment AvatarRound_data on Image {
  url
  alt
}`;

export default function AvatarRound(props) {
  return <img src={props.url} alt={props.alt} className="round"></img>
}

```

#### AvatarInfo.jsx <!-- .element: class="gray" style="line-height: 0.8" -->

```js
const fragment = gql`fragment AvatarInfo_data on Image {
  url
  alt
}`;

export default function AvatarInfo(props) {
  return <span>{props.url} ({props.alt})</span>;
}

```

#### Плевать на копипасту! <!-- .element: class="fragment red" -->

-----

## Мы инвестируем в безболезненный рефакторинг в будущем. <!-- .element: class="green" -->

-----

#### Первая компонента осталась без изменений

```js
const fragment = gql`fragment AvatarRound_data on Image {
  url
  alt
}`;

export default function AvatarRound(props) {
  return <img src={props.url} alt={props.alt} className="round"></img>
}

```

#### Бизнес потребовал показывать `description` вместо `alt`

```js
const fragment = gql`fragment AvatarInfo_data on Image {
  url
  description
}`;

export default function AvatarInfo(props) {
  return <span>{props.url} ({props.description})</span>;
}

```

-----

### Один компонент = один фрагмент

### Это позволяет изменять фрагменты и не бояться, что где-то что-то сломается в другом месте <!-- .element: class="fragment green" -->

-----

## Ошибка 2: Фрагмент хранить где-то в другом файле <!-- .element: class="red" -->

-----

## Это плохо <!-- .element: class="red" -->

#### Avatar_data.graphql <!-- .element: class="gray" style="line-height: 0.8" -->

```js
export const fragment = gql`fragment Avatar_data on Image {
  url
  alt
}`;

```

#### AvatarRound.jsx <!-- .element: class="gray" style="line-height: 0.8" -->

```js
import { fragment } from './Avatar_data.graphql';

export default function AvatarRound({ data }) {
  return <img src={data.url} alt={data.alt} className="round"></img>
}

```

-----

## Это хорошо <!-- .element: class="green" -->

#### AvatarRound.jsx <!-- .element: class="gray" style="line-height: 0.8 -->

```js
export const fragment = gql`
  fragment Avatar_data on Image {
    url
    alt
  }
`;

export default function AvatarRound({ data }) {
  return <img src={data.url} alt={data.alt} className="round"></img>
}

```

#### Относитесь к фрагменту, как к PropTypes'ам <!-- .element: class="fragment" -->

#### На основе фрагмента можно генерировать тайпинги для статической типизации <!-- .element: class="fragment" -->

-----

#### Помните про композицию компонентов и фрагментов <!-- .element: class="green" -->

##### User.jsx <!-- .element: class="gray" style="line-height: 0.8 -->

```js
import AvatarRound, { fragment } from './AvatarRound.jsx';

export const fragment = gql`
  fragment User_data on User {
    name
    avatar {
      ...Avatar_data
    }
  }
  ${fragment}
`;

export default function User({ name, avatar }) {
  return <div>{name} <AvatarRound data={avatar} /></div>
}

```

<div class="fragment" data-code-focus="1,7,10">Скомпоновали фрагмент</div>
<div class="fragment" data-code-focus="1,14">Скомпоновали компонент</div>
<div class="fragment" data-code-focus="1">Все импортнули с одного файла</div>

-----

### А что, если файл с компонентой и фрагментом становится большим?

### Уносить кусок React-компонента в новый под-файл и его используемый фрагмент туда же. <!-- .element: class="fragment green" -->

### Нет смысла разносить компоненту и фрагмент на два разных файла. <!-- .element: class="fragment red" -->

-----

## Ошибка 3: &lt;Query/&gt; не связывают с роутингом <!-- .element: class="red" -->

-----

## Переменные для GraphQL-запроса необходимо брать из `location`. <!-- .element: class="green" -->

### Я обычно &lt;Query /&gt; вызываю прям в роутинге. <!-- .element: class="fragment orange" -->

-----

### К примеру, для адреса:

### `/users?page=2&perPage=50`

##### Я буду запрос делать как-то так:

```js
function UsersPage() {
  const location = useLocation();
  const query = qs.parse(location.search);
  const { loading, error, data } = useQuery(USERS_QUERY, {
    variables: {
      page: query.page || 1,
      perPage: query.perPage || 10
    },
  });

  if (loading) return null;
  if (error) return `Error! ${error}`;
  return <UserPagination data={data} />;
}

```

<span class="fragment" data-code-focus="2" />
<span class="fragment" data-code-focus="3" />
<span class="fragment" data-code-focus="6-7" />
<span class="fragment" data-code-focus="13" />

-----

### Я использую get-параметры в качестве пользовательского стейта.

### Это позволяет скопировать адресную строку и в новом окне открыть тот же результат. <!-- .element: class="fragment green" -->

### URL не резиновый, поэтому храню только самое важное – фильтр, сортировки (что натыкал юзер для отображения страницы). <!-- .element: class="fragment orange" -->

-----

## Ошибка 4: C ApolloClient или Relay <br />не нужно использовать Redux <!-- .element: class="red" -->

-----

## Никакого Redux <!-- .element: class="orange" -->

## У ApolloClient или Relay есть: <!-- .element: class="fragment green" -->

- свой store <!-- .element: class="fragment green" -->
- свой механизм подписок (connect)<!-- .element: class="fragment green" -->
- свой механизм получения данных от сервера <!-- .element: class="fragment green" -->

### <br/>Забываем как страшный сон <br />эти самые экшены и редьюсеры! <!-- .element: class="fragment orange" -->

-----

## Recap: <!-- .element: class="green" -->

- <span class="fragment">Нельзя переиспользовать фрагменты</span>
- <span class="fragment">Нельзя фрагмент держать в другом файле</span>
- <span class="fragment">Не забывать &lt;Query/&gt; связывать с роутингом</span>
- <span class="fragment">Не крутить Redux к ApolloClient или Relay</span>
