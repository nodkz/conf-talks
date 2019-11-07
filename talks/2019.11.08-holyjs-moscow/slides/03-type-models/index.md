# 2. Type Models

-----

## Основа в `Type Models` это <span class="green">генерация</span> моделей из схемы, которую предоставил вам сервер.

-----

## Частенько такой же подход используется со Swagger'ом <br/>в REST API.

-----

### Получили описание серверного типа:

```graphql
type Image {
  url: URL!
  width: Int!
  # ... и еще 100500 полей
  # ... и еще 100500 полей
  # ... и еще 100500 полей
}

```

### Сгенерировали модель со всеми полями:

```typescript
interface ImageModel {
  getUrl(): string;
  getWidth(): number;
  // ... и еще 100500 методов
  // ... и еще 100500 методов
  // ... и еще 100500 методов
}

```

Генерация кода спасет мир! ❤️ <!-- .element: class="green fragment" -->

-----

## Опечатки пропадают <br/>и с типизацией становится всё нормально <!-- .element: class="green" -->

-----

## Но куда же без проблем <!-- .element: class="red" -->

-----

### Проблема 3: Недополучения данных (underfetch)

```diff
fragment SquareImage on Image {
  url
+ about
}

const SquareImageComponent = (model: SquareImage) => {
  const url = model.getUrl();
  const about = model.getAbout();

  return <img src={url} alt={about} />;
}

```

Серверный тип `Image` имеет поле `about`, <br/>а в запросе мы его забыли запросить.

-----

### Проблема 4: Получение лишних данных (overfetch)

```diff
fragment SquareImage on Image {
  url
  about
- width
- createdAt
}

const SquareImageComponent = (model: SquareImage) => {
  const url = model.getUrl();
  const about = model.getAbout();

  return <img src={url} alt={about} />;
}

```

`width` и `createdAt` тянем с сервера, <br />а в компоненте не используем.

-----

### Проблема 5: Масштабирование

### <br/>В Фейсбуке приблизительно <!-- .element: class="orange" -->

- ~30'000 типов
- ~200'000 полей

-----

## Представьте сколько классов и геттеров сгененрируется на базе серверной схемы! ☝️ <!-- .element: class="red" -->

-----

## От сгенерированного кода может использоваться только сотая часть. <!-- .element: class="orange" -->

## Это ужасно неоптимально. <!-- .element: class="red fragment" -->

-----

### Проблема 6: Алиасы в GraphQL-запросе

```graphql
fragment UserProfile on User {
  smallPic: image(width: 40) {
    url
  }
  bigPic: image(width: 400) {
    url
  }
}

```

<span class="fragment">Поле `image` будет сгенерировано из серверной схемы.</span>

<span class="fragment">А вот `smallPic` или `bigPic` придется ручками в модель добавлять. Опять чревато ошибками!</span>

-----

## Выводы по Type Models

<ul>
<li class="fragment green" data-fragment-index="0"><del>Опечатки (typos)</del> <!-- --></li>
<li class="fragment green" data-fragment-index="1"><del>Отсутствие типовой безопасности (type safety)</del> <!-- --></li>
<li class="fragment red" data-fragment-index="2">Недополучения данных (underfetch) <!-- --></li>
<li class="fragment red" data-fragment-index="3">Получение лишних данных (overfetch) <!-- --></li>
<li class="fragment red" data-fragment-index="4">Куча ненужного сгенерированного кода <!-- --></li>
<li class="fragment red current-fragment" data-fragment-index="5">С алиасами опять опечатки <!-- --></li>
</ul>

Note:
Генерация моделей из серверной схемы спасает от опечаток (typos) и отсутствия типовой безопасности (type safety).

Но проблема underfetch сохраняется: Если вы не запросили поле в запросе, то вы все равно сможете ошибочно вызвать это поле в вашей компоненте и нарваться на грех в рантайме (cannot read property of null, null pointer exception).

И проблема overfetch тоже никуда не девается: например вы упростили компоненту, перестав использовать какое-то поле и вдруг забыли удалить его в GraphQL-запросе, то вы будете тянуть данные ненужного поля на клиент. Ок, вы можете быть супер ответственным и удалить это поле и в запросе, но бац и приложение упало с проблемой `underfetch` – оказывается кто-то данные этого поля использует в другой части приложения. Т.е. если я удалил поле, то я должен пробежаться по всему приложению, чтобы убедиться в том, что его больше никто не использует.

-----

### Когда много команд на одном приложении

- ИЛИ все команды шарят между собой одну гигантскую библиотеку моделей <!-- .element: class="fragment" -->
- ИЛИ когда нет переиспользуемых компонентов/запросов между командами <!-- .element: class="fragment" -->
- ИЛИ разбивка на "собственные болота" моделей <!-- .element: class="fragment" -->

<!-- ## Самое гадкое

Билды приложения могу ломаться, если другие команды удаляют поля из GraphQL-запросов .element: class="fragment red" -->

-----

<table>
  <tr>
    <td>
      <img src="../manager-angry-semi.png" class="plain" style="min-width: 200px" />
      Бастық
    </td>
    <td style="vertical-align: middle;">
      <h2>Задача: </h2>
      <h2 class="red">Надо с underfetch разобраться! А тут еще и проблему лишнего кода подкинули.</h2>
    </td>
  </tr>
</table>
