# 1. JSON Models

-----

## По спецификации <br/>GraphQL возвращает <br/>ответ в виде JSON <!-- .element: class="orange" -->

-----

<table>
  <tr>
    <td>
      <img src="../manager-happy-semi.png" class="plain" style="min-width: 250px" />
      <br/>
      Бастық <span class="gray fragment"><br/>– это начальство по-казахски</span>
    </td>
    <td style="vertical-align: middle;">
      <h2 class="orange fragment">Слушайте ребята, <br/>у нас ответы от сервера не типизированы!</h2>
      <h2 class="green fragment"><br/>Давайте как-нибудь затипизируем, чтоб приложение было постабильнее.</h2>
    </td>
  </tr>
</table>

-----

## Напишем простую читалку JSONModel

```typescript
interface JSONModel {
  getJSON(key: string): JSONModel | null | void;
  getString(key: string): string | null | void;
  getInt(key: string): number | null | void;
  // ...
}

```

чтоб значения в компонентах были явно типизированные <!-- .element: class="fragment" -->

-----

### И когда захотите прочитать следующий ответ:

```graphql
fragment UserProfile on User {
  picture {
    url
    about
  }
}

```

### То код компоненты будет примерно таким:

```typescript
const UserProfileComponent = (model: JSONModel) => {
  const pic = model.getJSON('picture'); // as JSONModel;
  const uri = pic.getString('uri'); // as string;
  const about = model.getInt('about'); // as number;

  return <img src={uri} alt={about} />;
}

```

<span class="fragment" data-code-focus="2" data-code-block="1" />
<span class="fragment" data-code-focus="2" data-code-block="2" />
<span class="fragment" data-code-focus="3-4" data-code-block="1" />
<span class="fragment" data-code-focus="3-4" data-code-block="2" />
<span class="fragment" data-code-focus="6" data-code-block="2" />

Ага, в этом коде куча ошибок и проблем! <!-- .element: class="fragment red" -->

-----

#### Проблема 1.1: Опечатки (typos)

```diff
fragment UserProfile on User {
  picture {
    url
    about
  }
}

const UserProfileComponent = (model: JSONModel) => {
  const pic = model.getJSON('picture'); // as JSONModel;
- const uri = pic.getString('uri'); // as string;
+ const url = pic.getString('url'); // as string;
  const about = model.getInt('about'); // as number;

  return <img src={url} alt={about} />;
}

```

Запрашиваем `url`, а считываем в модели `uri`

-----

#### Проблема 1.2: Отсутствие типовой безопасности (type&nbsp;safety):

```diff
fragment UserProfile on User {
  picture {
    url
    about
  }
}

const UserProfileComponent = (model: JSONModel) => {
  const pic = model.getJSON('picture'); // as JSONModel;
  const url = pic.getString('url'); // as string;
-  const about = model.getInt('about'); // as number;
+  const about = model.getString('about'); // as string;

  return <img src={url} alt={about} />;
}

```

Запрашиваем поле `about: String`, <br/>а типизируем как `number`

-----

### Походу считываем еще и не с того объекта

```diff
fragment UserProfile on User {
  picture {
    url
    about
  }
}

const UserProfileComponent = (model: JSONModel) => {
  const pic = model.getJSON('picture'); // as JSONModel;
  const url = pic.getString('url'); // as string;
-  const about = model.getString('about'); // as string;
+  const about = pic.getString('about'); // as string;

  return <img src={url} alt={about} />;
}

```

-----

## А еще могут быть следующие проблемы

-----

#### Проблема 1.3: Недополучения данных (underfetch):

```diff
fragment UserProfile on User {
  picture {
    url
    about
  }
}

const UserProfileComponent = (model: JSONModel) => {
  const pic = model.getJSON('picture'); // as JSONModel;
  const url = pic.getString('url'); // as string;
+  const width = pic.getInt('width'); // as number;

  return <img src={url} width={width} />;
}

```

Это когда мы используем данные в нашей компоненте, <br/>но при этом не запрашиваем их в GraphQL-фрагменте

-----

#### Проблема 1.4: Получение лишних данных (overfetch):

```diff
fragment UserProfile on User {
  picture {
    url
    about
-   width
-   createdAt
  }
}

const UserProfileComponent = (model: JSONModel) => {
  const pic = model.getJSON("picture"); // as JSONModel
  const url = pic.getString("url"); // as string;
  const about = pic.getString("about"); // as string;

  return <img src={url} alt={about} />;
}
```

C JSON очень легко получить больше данных, чем вам надо

-----

## Обычно фронтендеры не считают получение лишних данных проблемой <!-- .element: class="orange" -->

-----

## НО запрос каждого лишнего поля тратит время <!-- .element: class="orange" -->

- на получение его из базы
- передачи по сети
- парсинге и хранении значения на клиенте

**страдают впустую все, кроме ленивого разработчика 🤓** <!-- .element: class="fragment red" -->

-----

## Вывод по JSON Models

-----

## С `JSON Models` вы получите следующие проблемы:

- Опечатки (typos) <!-- .element: class="fragment red" -->
- Отсутствие типовой безопасности (type safety) <!-- .element: class="fragment red" -->
- Недополучения данных (underfetch) <!-- .element: class="fragment red" -->
- Получение лишних данных (overfetch) <!-- .element: class="fragment red" -->

-----

## С горем пополам, JSON Models можно использовать если:

- код пишет один человек <!-- .element: class="fragment" -->
- контролируете код и сервера, и клиента <!-- .element: class="fragment" -->
- стабильные типы, редко меняющиеся <!-- .element: class="fragment" -->
- очень мальнькие запросы <!-- .element: class="fragment" -->
- можете протестировать каждое изменение <!-- .element: class="fragment" -->
- если вы студент 😉 <!-- .element: class="fragment" -->

-----

<table>
  <tr>
    <td>
      <img src="../manager-angry.png" class="plain" style="max-width: 200px" />
      <br/>
      Бастық
    </td>
    <td style="vertical-align: middle;">
      <h2>Задача: </h2>
      <h2 class="red">Cрочно что-то придумать с опечатками! A-A-a-A-a-A-а</h2>
    </td>
  </tr>
</table>
